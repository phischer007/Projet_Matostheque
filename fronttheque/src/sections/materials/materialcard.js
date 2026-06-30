import PropTypes from 'prop-types';
import { 
  ClockIcon, 
  Square3Stack3DIcon, 
  TruckIcon,
  PencilSquareIcon
} from '@heroicons/react/24/solid';
import { 
  Avatar, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider, 
  Link, 
  Stack, 
  SvgIcon, 
  Typography 
} from '@mui/material';

// ------------------------------------------------------------------------------------------------------ //

export const MaterialsCard = (props) => {
  const { material } = props;

  const images = material.images && material.images.length !== 0 ? JSON.parse(material.images) : {};

  let profil_image = material.user_profil && material.user_profil.length !== 0 ? JSON.parse(material.user_profil) : {};

  const profil_path = profil_image ? `${process.env.NEXT_PUBLIC_ASSETS}/${profil_image[0]}` : '';
  const image_path = images ? `${process.env.NEXT_PUBLIC_ASSETS}/${images[0]}` : '';

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid',       // Adds a 1px solid border
        borderColor: 'grey.300',   // Uses a subtle light-grey color from MUI's palette
        boxShadow: 3, 
        transition: 'box-shadow 0.3s ease-in-out', 
        '&:hover': {
          boxShadow: 6, 
        }
      }}
    >
      <CardContent sx={{pt:1}}>
        <Link
          underline="none"
          color="inherit"
          href={`/mutmat/details/material-detail/${material.material_id}`}>
          
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between" 
            sx={{ p: 1 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              {material.is_Movable &&
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                    <SvgIcon 
                      sx={{ color: 'white' }} 
                      fontSize="small"
                    >
                      <TruckIcon />
                    </SvgIcon>
                  </Avatar>
                  <Typography>
                    {material.is_Movable}
                  </Typography>
                </Stack>
              }

              {material.is_formation_required &&
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                    <SvgIcon 
                      sx={{ color: 'white' }} 
                      fontSize="small"
                    >
                      <PencilSquareIcon />
                    </SvgIcon>
                  </Avatar>
                  <Typography>
                    {material.is_formation_required}
                  </Typography>
                </Stack>
              }
            </Stack>

            {/* RIGHT SIDE: Name and Avatar */}
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1}
            >
              <Typography
                variant="overline"
                size="small"
              >
                {material.service_name ? material.service_name : material.user_first_name + " " + material.user_last_name}
              </Typography>
              <Avatar
                sx={{
                  height: 40,
                  width: 40
                }}
                src={profil_path}
              />
            </Stack>
          </Stack>
          {/* END UPDATED TOP HEADER */}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pb: 3
            }}
          >
            <CardMedia
              component="img"
              alt="Equipment Image"
              height="180"
              image={image_path}
            />
          </Box>
          <Typography
            align="center"
            gutterBottom
            variant="h5"
          >
            {material.material_title}
          </Typography>
          <Typography
            align="center"
            variant="body1"
          >
            {material.description}
  
          </Typography>
        </Link>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="flex-start"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <Square3Stack3DIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            Quantity: {material.quantity_available} 
          </Typography>
        </Stack>

        {material.loan_duration &&
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
          >
            <SvgIcon
              color="action"
              fontSize="small"
            >
              <ClockIcon />
            </SvgIcon>
            <Typography
              color="text.secondary"
              display="inline"
              variant="body2"
            >
              {material.loan_duration} Days
            </Typography>
          </Stack>
        }
      </Stack>
    </Card>
  );
};

MaterialsCard.propTypes = {
  material: PropTypes.object.isRequired
};