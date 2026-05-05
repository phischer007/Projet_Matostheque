import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { EnvelopeIcon, ClockIcon } from '@heroicons/react/24/solid';
import { Avatar, Box, Card, CardContent, CardMedia, Divider, Link, Stack, SvgIcon, Typography } from '@mui/material';
import NextLink from 'next/link';

export const MaterialsCard = (props) => {
  const { material } = props;

  // const images =  JSON.parse(material.images);
  const images = material.images && material.images.length !== 0 ? JSON.parse(material.images) : {};

  // let profil_image = JSON.parse(material.owner_profil);
  let profil_image = material.owner_profil && material.owner_profil.length !== 0 ? JSON.parse(material.owner_profil) : {};

  const profil_path = profil_image ? `${process.env.NEXT_PUBLIC_ASSETS}/${profil_image[0]}` : '';
  const image_path = images ? `${process.env.NEXT_PUBLIC_ASSETS}/${images[0]}` : '';

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardContent sx={{pt:1}}>
        <Link
          underline="none"
          color="inherit"
          href={`/matostheque/details/material-detail/${material.material_id}`}>
          <Stack
            xs={12}
            spacing={1} // Adjust spacing value as needed
            direction="row"
            alignItems="center"
            justifyContent= "flex-end"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              p: 1
            }}
          >
            <Typography
              variant="overline"
              size="small"
            >
              {material.team}
            </Typography>
            <Avatar
              sx={{
                height: 40,
                width: 40
              }}
              src={profil_path}
            />

          </Stack>
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
            <EnvelopeIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            Owner: {material.owner_first_name} {material.owner_last_name}
          </Typography>
        </Stack>
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
      </Stack>
    </Card>
  );
};

MaterialsCard.propTypes = {
  material: PropTypes.object.isRequired
};
