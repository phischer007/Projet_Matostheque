import { useCallback, useState, useEffect } from 'react';
import {Avatar,Box,Button,Card,CardActions,CardContent,Divider,Typography} from '@mui/material';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import { useAuth } from 'src/hooks/use-auth';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';

export const AccountProfile = (user_data) => {
  const auth = useAuth();
  const user = {
    ...user_data,
  }
  const images = user.profil_pic;
  const image_path = images? `${process.env.NEXT_PUBLIC_ASSETS}/${images[0]}` : '';

  const [selectedImage, setImage] = useState([]);
  const [filesSelected, setFilesSelected] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      // Select only the first file
      const selectedFile = event.target.files[0];
      setFilesSelected(true);
      setImage(selectedFile);
    } else {
      setFilesSelected(false);
    }
  };

  const handleUploadPictures = useCallback(async () => {
    if (!selectedImage) {
      toast.error("No picture selected!", { autoClose: false });
      return;
    }

    const form = new FormData();
    form.append("image", selectedImage);

    if (!form.has("image")) {
      console.error("No image file added to FormData");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/users/upload_pictures/${user_data.user_id}/`, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        let decodeResponse = JSON.parse(errorMessage);
        toast.error(decodeResponse.message, { autoClose: false });
      } else {
        toast.success("Pictures uploaded successfully!", { autoClose: false });
        await auth.updateUser(user_data.user_id);
        window.location.reload();
      }
    } catch (error) {
      toast.error(`Error trying to upload pictures: ${error}`, { autoClose: false });
    }
  }, [selectedImage]);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={image_path}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {user.first_name} {user.last_name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.role} account
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.email}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="text"
          component="label"
          htmlFor="upload-button"
          color={filesSelected ? 'success' : 'primary'}
          sx={{
            paddingX: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            marginRight: 1,
          }}
        >
          {filesSelected ? (
            <CheckCircleIcon width="25px" height="25px" sx={{ color: 'success.main', }} /> // Render check icon when files are selected
          ) : (
            <ArrowUpOnSquareIcon width="25px" height="25px" />
          )}
          <span style={{ width: '120px' }}>{filesSelected ? 'File Selected' : 'Choose Picture'}</span>
          <input
            id="upload-button"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Button>
        <Button
          onClick={handleUploadPictures}
          variant="outlined"
        >
          Upload
        </Button>
      </CardActions>
    </Card>
  );
}
