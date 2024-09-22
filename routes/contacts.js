import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';



const router = express.Router();

//prisma setup
const prisma = new PrismaClient({
   log: ['query', 'info', 'warn', 'error'],
  });
  

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



//routes
router.get('/', (req, res) => {
  res.send('Contacts route');
});

// Get all contacts
router.get('/all', async(req, res) => {
  const contacts = await prisma.contact.findMany();
  res.json(contacts);

});
  
// Get a contact by id
router.get('/get/:id', async(req, res) => {
  const id = req.params.id;

  //By ID
  const contact = await prisma.contact.findUnique({
    where:{
      id: parseInt(id),
    },
  });

  res.json(contact);
});
  
// add post(with multer)
router.post('/create', upload.single('image'), async (req, res) => {

  const filename = req.file ? req.file.filename : null;
  const { firstName, lastName, email, phone, title } = req.body;


  //model Contact {

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
  


router.put('/update/:id', upload.single('image'),(req, res) => {
  const id = req.params.id;
  res.send('Update contact by id ' + id);
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  res.send('Delete contact by id ' + id);
})

export default router;
