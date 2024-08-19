const express = require('express');
const { v4: uuidv4 } = require("uuid")
const session = require('express-session');
const app = express();
const port = 3000; // Define the port to listen on

const db = require("./firebase")

app.set('view engine', 'ejs')

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Define a route
// app.get('/', (req, res) => {
//   res.send('Hello, Express!');
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use('/public', express.static('public', {
//   setHeaders: (res, filePath) => {
//     // Set the Content-Type header based on the file's MIME type
//     const contentType = mime.getType(path.extname(filePath));
//     res.setHeader('Content-Type', contentType);
//   },
// }));


const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    // Store the original URL in the session
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
};


app.get('/login', (req, res) => {
  res.render('login');
});



app.post("/login", async (req, res) => {


  req.session.user = { username: req.body.username };

  if (req.session.returnTo) {
    const lastSlashIndex = req.session.returnTo.lastIndexOf('/');

    // Use substring to extract the UUID
    const listId = req.session.returnTo.substring(lastSlashIndex + 1);

    await db.collection("task-lists").doc(listId).
    collection("users").doc(req.body.username).set(req.body);


    res.redirect(req.session.returnTo);
    return;
  }

  let taskListId = uuidv4();
  let taskList = await db.collection("task-lists").doc(taskListId).
    collection("users").doc(req.body.username).set(req.body);

  res.redirect(`/groceries/${taskListId}`);

})

app.get('/groceries/:id', isLoggedIn,  (req, res) => {

  // TODO: send current user data and list id to template,
  // res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.render("groceries", {
    currUser : req.session.user.username,
    listId : req.params.id

  })
})


app.get('/api/groceries/:id', async (req, res) => {


  const taskListId = req.params.id;

  let listUsers = await db.collection("task-lists").doc(taskListId).
              collection("users").get();


  let taskListData = listUsers.docs;

  // var listItems = await db.collection("task-lists").doc(taskListId).
  //   collection("users").doc("mustafa").collection("items").
  //   get().docs;
  // TODO: allow posting of items from front-end
  // TODO: allow polling of items to front-end (i.e.,. make UI reflect)


    var listItems = await db.collection("task-lists").doc(taskListId).
    collection("users").doc("mustafa").collection("items").get();

    let newListItems = listItems.docs.map(obj => {
      return obj.get("itemName"); //I was just missing the return keyword
    })
  // console.log(taskListData)

  //TODO: also try to create a merged list containing list of usernames for that list and under each username are the associated items with that user.
  let listUsersAndItems = taskListData.map(obj =>  {

    // let listItems = await db.collection("task-lists").doc(taskListId).
    // collection("users").doc(obj.data().username).collection("items").
    // get().docs;

    // let listItems = await db.collection("task-lists").doc(taskListId).
    // collection("users").doc("mustafa").collection("items").
    // get();

    // listItems = listItems.docs;


    // let reducedListItems = listItems.map(async obj => {
    //   return (await obj.get());
    // })

    return {username: obj.data().username,
            items: listItems}
  })

  // TODO: send current user data and list id to template, DONE in an other place. No need to implement.
  res.send(listUsersAndItems)
})

// TODO: add endpoint to allow the addition of an item to a grocery list
app.post("/api/groceries/:id/items", isLoggedIn, async (req, res) => {
  


})



// Start the server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server gracefully...');

  // Close the server to stop accepting new connections
  server.close((err) => {
    if (err) {
      console.error('Error while shutting down the server:', err);
      process.exit(1);
    }
    console.log('Server has been gracefully terminated.');
    process.exit(0);
  });
});

process.on('SIGTSTP', () => {
  console.log('Shutting down server gracefully...');

  // Close the server to stop accepting new connections
  server.close((err) => {
    if (err) {
      console.error('Error while shutting down the server:', err);
      process.exit(1);
    }
    console.log('Server has been gracefully terminated.');
    process.exit(0);
  });
});

