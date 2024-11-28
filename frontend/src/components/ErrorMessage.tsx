import { Alert } from '@mui/material';

const ErrorMessage = ({ message }: { message: string }) => {
  return <Alert severity="error">{message}</Alert>;
};

export default ErrorMessage;
