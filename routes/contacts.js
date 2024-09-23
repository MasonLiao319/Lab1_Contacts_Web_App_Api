import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';



const router = express.Router();

//prisma setup
const prisma = new PrismaClient({
   log: ['query', 'info', 'warn', 'error'],
  }); //log out the error
  

//Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'public/images/'); // save uploaded files in `public/images` folder
  },
  filename: function (req, file, cb) {
  const ext = file.originalname.split('.').pop(); // get file extension
  const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext; // generate unique filename - current timestamp + random number between 0 and 1000.
  cb(null, uniqueFilename);
  }
  });

  const upload = multer({ storage: storage });


//
// Routes
//
// router.get('/', (req, res) => {
//   res.send('Contacts route');
// });

// Get all contacts
router.get('/all', async(req, res) => {
  const contacts = await prisma.contact.findMany();
  res.json(contacts);

});
  
// Get a contact by id
router.get('/get/:id', async(req, res) => {
  const id = req.params.id;
  
  //validation: id is a number
  if(isNaN(id)){
    res.status(400).json({ message: 'Invalid contact ID'});
    return;
  }

  //By ID
  const contact = await prisma.contact.findUnique({

    //where clause
    where:{
      id: parseInt(id),  
    },
  });

  if(contact){
    res.json(contact);
  }else{
    res.status(404).json({message: 'Contact not found.'});
  }
  
});
  

//Add a new contact
// add post(with multer)
router.post('/create', upload.single('image'), async (req, res) => {

  const filename = req.file ? req.file.filename : null;
  const { firstName, lastName, email, phone, title } = req.body;
  

  if (!firstName || !lastName || !email || !phone){
    // to-do: delete uploaded file
    res.status(400).json({ message: 'Required fields must have a value.'});
    return;
  }
 

  const contact = await prisma.contact.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      title: title,
      filename: filename
    },
  });

    res.json(contact);
  });
  

//Update a contact by id (with multer)
router.put('/update/:id', upload.single('image'),(req, res) => {//make sure the name is same in both places
  const id = req.params.id;  //should have the data that need to update, like create function
  
  // capture the remaining inputs

  // validate the inputs

  // get the contacts by id. return 404 if not found.

  // if image file is uploaded: get the filename to save in db. delete the old image file. set the filename to new filename

  // if image file NOT uploaded: when updating record with prisma. Set the filename to oldfilename

  // update record in the db. (ensuring filename is new or old name)

  res.send('Update contact by id ' + id);   // where clause and data structure
});


//Delete a contact by id
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

 

  // validate the input

  // get contact by id. return 404 if not found.

  // delete the image file.

  // delete the contact in db.



  res.send('Delete contact by id ' + id);
})

export default router;
