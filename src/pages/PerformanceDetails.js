import { Avatar, Box, Chip, ImageList, Skeleton, Stack, Typography } from '@mui/material';

import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import DataWidget from 'ui-component/DataWidget';
import SubmitFormButton from 'ui-component/SubmitFormButton';
import TextInput, { SelectInput } from 'ui-component/TextInput';
import AddImageCard from 'ui-component/image/AddImageCard';
import ImageCard from 'ui-component/image/ImageCard';
import { Fetcher } from 'utils/api';
import { compareObj, seasons, toastMessage } from 'utils/helpers';
import * as Yup from 'yup';

const PerformanceDetails = () => {
  const scriptedRef = useScriptRef();
  //
  const { id } = useParams();
  const {
    data: performance,
    isLoading,
    error
  } = useQuery({ queryKey: ['performances', id], queryFn: () => Fetcher.get('performances/' + id), retry: false });

  //
  const clientQuery = useQueryClient();

  const handleUpdated = (newPerformance) => {
    clientQuery.setQueryData(['performances', id], { ...performance, ...newPerformance });
  };

  return (
    <Stack sx={{ backgroundColor: 'white', borderRadius: 4, p: 0, overflow: 'hidden' }}>
      <DataWidget
        title="Performance"
        isLoading={isLoading}
        isError={error}
        customLoaders={
          <>
            <Stack sx={{ bgcolor: 'grey.300', p: 4, py: 6 }}>
              <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <Skeleton animation="wave" variant="circular" sx={{ backgroundColor: 'white' }} height={80} width={80} />
                <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: 'white' }} height={30} width={400} />
              </Stack>
            </Stack>
            <Box sx={{ p: 4, px: 5 }}>
              {/* <Skeleton animation="wave" variant="rounded" height={30} /> */}
              {/* <Box sx={{ my: 1 }} /> */}
              <Skeleton animation="wave" variant="rounded" height={35} width={'70%'} />
              <Box sx={{ my: 3 }} />
              <Stack spacing={2} direction={'row'}>
                {[1, 2, 3, 4, 5].map((_, index) => {
                  return <Skeleton key={index} animation="wave" variant="rectangular" sx={{ width: '100%' }} height={170} />;
                })}
              </Stack>
              <Box sx={{ my: 3 }} />
              <Skeleton animation="wave" variant="rounded" height={50} sx={{ borderRadius: 2 }} />
              <Box sx={{ my: 1.5 }} />
              <Skeleton animation="wave" variant="rounded" height={50} sx={{ borderRadius: 2 }} />
              <Box sx={{ my: 1.5 }} />
              <Skeleton animation="wave" variant="rounded" height={50} sx={{ borderRadius: 2 }} />
              <Box sx={{ my: 3 }} />
              <Skeleton animation="wave" variant="rounded" height={50} sx={{ borderRadius: 2 }} />
              <Box sx={{ my: 2 }} />
            </Box>
          </>
        }
      >
        <Stack sx={{ position: 'relative' }}>
          <img
            src={performance?.images[0]}
            alt="#"
            height={160}
            width={100}
            style={{ width: '100%', objectFit: 'cover', opacity: 0.8, backgroundAttachment: 'fixed' }}
          />
          {/* <Container sx={{ my: 3 }} /> */}
          <Stack direction="row" alignItems={'center'} spacing={2} sx={{ position: 'absolute', bottom: 0, top: 0, p: 2, px: 5 }}>
            <Avatar src={performance?.userProfile?.profilePic} sx={{ width: 80, height: 80 }}>
              <Typography variant="h1">A</Typography>
            </Avatar>
            <Typography sx={{ color: 'white' }} variant="h2">
              @{performance?.userProfile?.username}
            </Typography>
          </Stack>
        </Stack>
        <Stack sx={{ p: 3, px: 5 }} spacing={1}>
          <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 1 }}>
            <Typography variant="h2">{performance?.title}</Typography>
            <Chip
              label={performance?.seasonName}
              size="small"
              color={'primary'}
              sx={{
                px: 0.5,
                fontSize: '12px',
                color: 'white'
              }}
            />
          </Stack>
          <ImageList cols={5} rowHeight={170}>
            {performance?.images.map((image, index) => {
              return (
                <ImageCard
                  key={index}
                  image={image}
                  performanceId={performance?.id}
                  canDelete={performance?.images?.length > 3}
                  onSuccess={handleUpdated}
                />
              );
            })}
            {performance?.images?.length < 5 && <AddImageCard id={performance?.id} onAdded={handleUpdated} />}
          </ImageList>
          <Formik
            initialValues={{
              title: performance?.title || '',
              description: performance?.description || '',
              videoUrl: performance?.videoUrl || '',
              duration: performance?.duration || '',
              seasonName: performance?.seasonName || 'SEASON_3'
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string().min(20).max(100).required('Title is required'),
              description: Yup.string().min(50).max(300).required('Description is required'),
              seasonName: Yup.string()
                .oneOf(
                  seasons.map((season) => season.value),
                  'Invalid season'
                )
                .required('Season is required'),
              duration: Yup.string()
                .matches(/^\d{2}:\d{2}$/, 'Invalid duration format. Use hh:mm')
                .required('Duration is required'),
              videoUrl: Yup.string()
                .matches(
                  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(\?\S+)?$/,
                  'Invalid YouTube video URL format'
                )
                .required('YouTube video url is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                if (scriptedRef.current) {
                  //
                  const newObj = compareObj(performance, {
                    ...values,
                    submit: undefined
                  });
                  if (!Object.keys(newObj).length) {
                    throw new Error('No changes made.');
                  }
                  const performanceData = await Fetcher.patch('performances/' + performance?.id, newObj);
                  // onUpdated(award);
                  toastMessage(`Performance has updated succesfully. <b>${performanceData?.title}</b>`);

                  setSubmitting(false);
                  setStatus({ success: true });
                }
              } catch (err) {
                if (scriptedRef.current) {
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => {
              return (
                <form noValidate onSubmit={handleSubmit}>
                  <TextInput
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    name="title"
                    label="Title"
                  />
                  <TextInput
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    name="videoUrl"
                    label="YouTube Video"
                  />
                  <TextInput
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    name="duration"
                    label="Duration"
                  />
                  <TextInput
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    multiline={true}
                    rows={5}
                    name="description"
                    label="Description"
                  />
                  <SelectInput
                    items={seasons}
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    name="seasonName"
                    label="Season"
                  />
                  <SubmitFormButton title={'Edit Performance'} errors={errors} isSubmitting={isSubmitting} />
                </form>
              );
            }}
          </Formik>
        </Stack>
      </DataWidget>
    </Stack>
  );
};

export default PerformanceDetails;
