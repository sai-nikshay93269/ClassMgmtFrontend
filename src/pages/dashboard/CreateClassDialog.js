import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useDispatch, useSelector } from '../../redux/store';
import { createClass } from '../../redux/slices/classSlice';
import FormProvider from '../../components/hook-form/FormProvider';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { Close } from '@mui/icons-material';

const CreateClassDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { isLoading } = useSelector((state) => state.class);

  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ State to handle button disabling
  const userRole = useSelector((state) => state.auth.user.role);

  // Validation Schema
  const classSchema = Yup.object().shape({
    name: Yup.string().required('Class Name is required'),
    description: Yup.string().required('Description is required'),
  });

  const methods = useForm({
    resolver: yupResolver(classSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { setError, handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (data) => {
    setIsSubmitting(true); // ✅ Disable button on submit

    dispatch(createClass({
        name: data.name,
        description: data.description,
        teacherId: user?.id, 
    }))
    .then((response) => {
        console.log(response);
        setAlert({ open: true, message: 'Class created successfully!', severity: 'success' });

        // ✅ Keep button disabled until timeout completes
        setTimeout(() => {
            setAlert({ open: false, message: '', severity: '' });
            handleClose();
            setIsSubmitting(false); // ✅ Re-enable button AFTER timeout
        }, 2000);
    })
    .catch((error) => {
        console.error('Create Class Error:', error);

        let errorMessage = "Failed to create class. Try again!";
        if (error.message) {
            errorMessage = error.message;
        }

        setAlert({
            open: true,
            message: errorMessage,
            severity: 'error',
        });

        setIsSubmitting(false); // ✅ Re-enable button immediately on error
    });
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New Class</DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Close />
        </IconButton>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

              <RHFTextField name="name" label="Class Name" />
              <RHFTextField name="description" label="Description" multiline rows={3} />

            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
           
             <Stack spacing={2} direction='row' alignItems='center' justifyContent='end'>
                      <Button onClick={handleClose} >Cancel</Button>
                      <Button type='submit' variant='contained' disabled={isSubmitting || isLoading}>
                      Create Class
                      </Button>
                    </Stack>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default CreateClassDialog;
