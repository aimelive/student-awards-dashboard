import { Avatar, Box, ImageList, Skeleton, Stack, Typography } from '@mui/material';

import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import DataWidget from 'ui-component/DataWidget';
import SubmitFormButton from 'ui-component/SubmitFormButton';
import TextInput from 'ui-component/TextInput';
import AddImageCard from 'ui-component/image/AddImageCard';
import ImageCard from 'ui-component/image/ImageCard';
import { Fetcher } from 'utils/api';
import { compareObj, toastMessage } from 'utils/helpers';
import * as Yup from 'yup';

const ActivityDetails = () => {
  const scriptedRef = useScriptRef();
  //
  const { id } = useParams();
  const {
    data: activity,
    isLoading,
    error
  } = useQuery({ queryKey: ['activities', id], queryFn: () => Fetcher.get('activities/' + id), retry: false });

  //
  const clientQuery = useQueryClient();

  const handleUpdated = (newActivity) => {
    clientQuery.setQueryData(['activities', id], { ...activity, ...newActivity });
  };

  return (
    <Stack sx={{ backgroundColor: 'white', borderRadius: 4, p: 0, overflow: 'hidden' }}>
      <DataWidget
        title="Activity Feed"
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
            src={activity?.images[0]}
            alt="#"
            height={160}
            width={100}
            style={{ width: '100%', objectFit: 'cover', opacity: 0.8, backgroundAttachment: 'fixed' }}
          />
          {/* <Container sx={{ my: 3 }} /> */}
          <Stack direction="row" alignItems={'center'} spacing={2} sx={{ position: 'absolute', bottom: 0, top: 0, p: 2, px: 5 }}>
            <Avatar src={activity?.userProfile?.profilePic} sx={{ width: 80, height: 80 }}>
              <Typography variant="h1">A</Typography>
            </Avatar>
            <Typography sx={{ color: 'white' }} variant="h2">
              @{activity?.userProfile?.username}
            </Typography>
          </Stack>
        </Stack>
        <Stack sx={{ p: 3, px: 5 }} spacing={1}>
          <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 1 }}>
            <Typography variant="h2">{activity?.title}</Typography>
          </Stack>
          <ImageList cols={5} rowHeight={170}>
            {activity?.images.map((image, index) => {
              return (
                <ImageCard
                  key={index}
                  image={image}
                  performanceId={activity?.id}
                  canDelete={activity?.images?.length > 3}
                  onSuccess={handleUpdated}
                  isActivity={true}
                />
              );
            })}
            {activity?.images?.length < 5 && <AddImageCard id={activity?.id} onAdded={handleUpdated} isActivity={true} />}
          </ImageList>
          <Formik
            initialValues={{
              title: activity?.title || '',
              caption: activity?.caption || ''
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string().min(20).max(100).required('Title is required'),
              caption: Yup.string().min(50).max(300).required('Caption is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                if (scriptedRef.current) {
                  //
                  const newObj = compareObj(activity, {
                    ...values,
                    submit: undefined
                  });
                  if (!Object.keys(newObj).length) {
                    throw new Error('No changes made.');
                  }
                  const activityData = await Fetcher.patch('activities/' + activity?.id, newObj);
                  handleUpdated(activityData);
                  toastMessage(`Activity has updated succesfully. <b>${activityData?.title}</b>`);

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
                    multiline={true}
                    rows={3}
                    name="caption"
                    label="Caption"
                  />
                  <SubmitFormButton title={'Edit Activity'} errors={errors} isSubmitting={isSubmitting} />
                </form>
              );
            }}
          </Formik>
        </Stack>
      </DataWidget>
    </Stack>
  );
};

export default ActivityDetails;
