import { useCallback, useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider, 
  CardActions, 
  Button, 
  ImageList, 
  ImageListItem,
  IconButton
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import imageCompression from 'browser-image-compression';

import { TrashIcon } from '@heroicons/react/24/solid';



const compressAndUploadImages = async (images) => {
  const compressedImages = [];

  for (const file of images) {
    try {
      const compressedImage = await imageCompression(file, {
        maxSizeMB: 0.5, // Set the maximum file size in megabytes
        maxWidthOrHeight: 1920, // Set the maximum width or height of the image 1920x1920
        useWebWorker: true, // Use web worker for faster compression (optional)
      });

      compressedImages.push(compressedImage);
    } catch (error) {
      console.error('Image compression failed:', error);
    }
  }

  return compressedImages;
};

export const MaterialDetailViewer = (props) => {
  const data = props.data ? JSON.parse(props.data) : null;
  const [images, setImages] = useState([]);
  const [filesSelected, setFilesSelected] = useState(false);
  const user = useAuth().user;
  const material_id = props?.id;
  const [authorizeUpload, setAuthorizeUpload] = useState(false);

  useEffect(() => {
    if (user.user_id == props.owner || user.is_staff)
      setAuthorizeUpload(true);
  }, [props]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFilesSelected(true);
      setImages([...event.target.files]);
    } else {
      setFilesSelected(false);
    }
  };

  // Function to handle image deletion
  const handleDeleteImage = async (indexToDelete) => {
    if (!data) return;

    if (!window.confirm("Are you sure you want to delete this picture?")) {
      return;
    }

    // Create a new list excluding the image at the specified index
    const updatedImageList = data.filter((_, index) => index !== indexToDelete);

    try {
      // We send the updated list as a JSON string to the 'images' field
      // The backend serializer will update the TextField with this new string
      const response = await fetch(`${config.apiUrl}/materials/${material_id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            images: JSON.stringify(updatedImageList)
        })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        // Try to parse JSON error if possible, otherwise use text
        try {
            const decodeResponse = JSON.parse(errorMessage);
            toast.error(decodeResponse.message || "Failed to delete image", { autoClose: false });
        } catch (e) {
            toast.error("Failed to delete image.", { autoClose: false });
        }
      } else {
        toast.success("Picture deleted successfully!", { autoClose: false });
        window.location.reload();
      }
    } catch (error) {
      toast.error(`Error trying to delete picture: ${error}`, { autoClose: false });
    }
  };

  const handleUploadPictures = useCallback(async () => {
    if (images.length === 0) {
      toast.error("No pictures to upload!", { autoClose: false });
      return;
    }

    const imageData = Array.from(images);
    const compressedImages = await compressAndUploadImages(imageData);

    const form = new FormData();
    compressedImages.forEach((image, index) => {
      form.append(`image_${index}`, image);
    });

    try {
      const response = await fetch(`${config.apiUrl}/materials/${material_id}/`, {
        method: 'PUT',
        body: form,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        let decodeResponse = JSON.parse(errorMessage);
        toast.error(decodeResponse.message, { autoClose: false });
      } else {
        const data = await response.json();
        toast.success("Pictures uploaded successfully!", { autoClose: false });
        window.location.reload();
      }
    } catch (error) {
      toast.error(`Error trying to upload pictures: ${error}`, { autoClose: false });
    }
  }, [images]);



  return (
    <Card>
      {data ?
        <CardContent
          sx={{
            p: 0
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <ImageList sx={{ width: 500 }} cols={Math.min(data.length, 3)}>
              {data.map((value, idx) => {
                return (
                  <ImageListItem key={idx} sx={{ minHeight: 300 }}>
                    <img
                      srcSet={`${process.env.NEXT_PUBLIC_ASSETS}/${value}`}
                      src={`${process.env.NEXT_PUBLIC_ASSETS}/${value}`}
                      alt="Pictures of the material"
                      loading="lazy"
                    />

                    {/* Delete Button Overlay */}
                    {authorizeUpload && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '50%',
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteImage(idx)}
                          sx={{ color: 'red' }}
                          title="Delete Picture"
                        >
                          <TrashIcon width="20px" height="20px" />
                        </IconButton>
                      </Box>
                    )}


                  </ImageListItem>
                )
              })}
            </ImageList>
          </Box>
        </CardContent>
        : <CardContent>
          <Typography
            gutterBottom
            variant="h6"
          >
            No pictures added yet.
          </Typography>
        </CardContent>}
      <Divider />
      {authorizeUpload ?
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button
            variant="text"
            component="label"
            htmlFor="upload-button"
            color= {filesSelected ? 'success' : 'primary'}
            sx={{
              paddingX : 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              marginRight: 1,
            }}
          >
            {filesSelected ? (
              <CheckCircleIcon  width="25px" height="25px" sx={{ color: 'success.main',  }} /> // Render check icon when files are selected
            ) : (
              <ArrowUpOnSquareIcon width="25px" height="25px" />
            )}
            <span style={{ width: '120px' }}>{filesSelected ? 'Files Selected' : 'Choose Pictures'}</span>
            <input
              id="upload-button"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Button>
          <Button
            onClick={handleUploadPictures}
            variant="contained"
          >
            Upload
          </Button>
        </CardActions>
        : null}
    </Card>
  )
}
