import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Modal,
  Box,
  TextField,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { firestore } from '../utils/firebase';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  class: string;
  section: string;
  address: string;
  parentName: string;
  parentContact: string;
  rollNumber: string;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const StudentSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    class: Yup.string().required('Class is required'),
    section: Yup.string().required('Section is required'),
    address: Yup.string().required('Address is required'),
    parentName: Yup.string().required('Parent Name is required'),
    parentContact: Yup.string().matches(/^\d{10}$/, 'Parent Contact must be 10 digits'),
    rollNumber: Yup.string().required('Roll Number is required'),
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'students'));
      const studentsList = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Student[];
      setStudents(studentsList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addStudent = async (values: Student, { resetForm }: any) => {
    try {
      const docRef=await addDoc(collection(firestore, 'students'), values);
      fetchStudents();
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const updateStudent = async (values: Student, { resetForm }: any) => {
    if (editingStudent) {
      try {
        const { id, ...studentData } = values;
        const studentRef = doc(firestore, 'students', editingStudent.id);
        await updateDoc(studentRef, studentData);
        fetchStudents();
        setOpenModal(false);
        resetForm();
        setEditingStudent(null);
      } catch (error) {
        console.error('Error updating student:', error);
      }
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const studentRef = doc(firestore, 'students', id);
      await deleteDoc(studentRef);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setOpenModal(true);
  };

  return (
    <Box>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => {
          setEditingStudent(null);
          setOpenModal(true);
        }}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          marginLeft: '250px', 
          padding: '16px',
          overflowX: 'auto',
        }}
      >
        Add Student
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  <IconButton>
                    <ViewIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditClick(student)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteStudent(student.id)
                  }>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Formik
            enableReinitialize
            initialValues={{
              id: editingStudent?.id || '',
              firstName: editingStudent?.firstName || '',
              lastName: editingStudent?.lastName || '',
              email: editingStudent?.email || '',
              phoneNumber: editingStudent?.phoneNumber || '',
              dateOfBirth: editingStudent?.dateOfBirth || '',
              gender: editingStudent?.gender || '',
              class: editingStudent?.class || '',
              section: editingStudent?.section || '',
              address: editingStudent?.address || '',
              parentName: editingStudent?.parentName || '',
              parentContact: editingStudent?.parentContact || '',
              rollNumber: editingStudent?.rollNumber || '',
            }}
            validationSchema={StudentSchema}
            onSubmit={editingStudent ? updateStudent : addStudent}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={values.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Gender"
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.gender && Boolean(errors.gender)}
                      helperText={touched.gender && errors.gender}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Class"
                      name="class"
                      value={values.class}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.class && Boolean(errors.class)}
                      helperText={touched.class && errors.class}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Section"
                      name="section"
                      value={values.section}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.section && Boolean(errors.section)}
                      helperText={touched.section && errors.section}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Parent Name"
                      name="parentName"
                      value={values.parentName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.parentName && Boolean(errors.parentName)}
                      helperText={touched.parentName && errors.parentName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Parent Contact"
                      name="parentContact"
                      value={values.parentContact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.parentContact && Boolean(errors.parentContact)}
                      helperText={touched.parentContact && errors.parentContact}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Roll Number"
                      name="rollNumber"
                      value={values.rollNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.rollNumber && Boolean(errors.rollNumber)}
                      helperText={touched.rollNumber && errors.rollNumber}
                    />
                  </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </Box>
  );
};

export default StudentsPage;
