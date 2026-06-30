import ReactLoading from 'react-loading';
import { Card,Typography } from '@mui/material';

export const Loading = ({message}) => {
    return (
        <Card
          style={{
            position: 'fixed',
            top: 75,
            right: 20,
            padding: 5,
            display: 'flex',
            alignItems: 'center',
            zIndex: 9999, 
          }}
          sx={{
            borderRadius: 1,
            height: 40,
            width: 100
          }}
        >
          <ReactLoading type={'spin'} color={'blue'} height={20} width={20} />
          <Typography variant="caption" style={{ marginLeft: 5 }}>{message}...</Typography>
        </Card>
      );
}