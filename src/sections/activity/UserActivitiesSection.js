import { Box, Grid, Stack } from '@mui/material';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import ChooseMultipleImages from 'ui-component/ChooseMultipleImages';
import DataWidget from 'ui-component/DataWidget';
import ItemCard from 'ui-component/ItemCard';
import SubmitFormButton from 'ui-component/SubmitFormButton';
import TextInput from 'ui-component/TextInput';
import TitleAndSidebar from 'ui-component/TitleAndSidebar';
import { Fetcher } from 'utils/api';
import { toastMessage } from 'utils/helpers';
import * as Yup from 'yup';

const UserActivitiesSection = ({ activities, profile, onAdded, onDelete }) => {
  const scriptedRef = useScriptRef();
  //
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  //
  const [images, setImages] = useState([]);
  return (
    <>
      <Box sx={{ mt: 2 }} />
      <TitleAndSidebar
        title="Feed Activities"
        drawerTitle={'Add Activity'}
        openSidebar={openModal}
        onOpenSidebar={handleOpenModal}
        onCloseSidebar={handleCloseModal}
        customTitle={true}
      >
        <Formik
          initialValues={{
            title: '',
            caption: ''
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().min(20).max(100).required('Title is required'),
            caption: Yup.string().min(50).max(300).required('Caption is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                if (images.length < 3) {
                  throw new Error(images.length ? 'Please add three images at least' : 'Please add images to this feed');
                }
                const activity = await Fetcher.post('activities', {
                  ...values,
                  images: images.map((img) => img.url),
                  userProfileId: profile?.id,
                  submit: undefined
                });
                onAdded(activity);
                toastMessage(`<b>@${profile?.username}</b> has given new activity to feed. 🎉 <b>${activity.title}</b>`);

                setSubmitting(false);
                setStatus({ success: true });

                handleCloseModal();
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
                <ChooseMultipleImages
                  label={'Feed Activity Images'}
                  onChange={(images) =>
                    setImages((prev) => {
                      const arr = [...prev, ...images];
                      return arr.slice(0, 5);
                    })
                  }
                  images={images}
                  onRemove={(file) => {
                    setImages((prev) => prev.filter((img) => img.name !== file.name));
                  }}
                />
                <SubmitFormButton title={'Add to Feed'} errors={errors} isSubmitting={isSubmitting} />
              </form>
            );
          }}
        </Formik>
      </TitleAndSidebar>
      <DataWidget
        title="Activities"
        isEmpty={!activities?.length}
        customEmptyMessage="There are no activities associated with this user, create a new one by clicking add button above."
      >
        <Stack direction="row" spacing={2} xs={{ width: '100%', overflowX: 'auto' }}>
          {activities?.map((item, index) => {
            return <ActivityCard key={index} item={item} onDelete={onDelete} />;
          })}
        </Stack>
      </DataWidget>
    </>
  );
};

const ActivityCard = ({ item, onDelete }) => {
  const nav = useNavigate();

  const { isLoading, mutate } = useMutation({
    mutationFn: () => Fetcher.delete('activities/' + item.id),
    onSuccess: (activity) => {
      toastMessage(`Activity <b>${activity.title}</b> has removed succesfully`, { isWarning: true });
      onDelete(activity);
    },
    onError: (error) => {
      toastMessage(error.message, { isError: true });
    }
  });
  return (
    <Grid item={true} xs={12} sm={6}>
      <ItemCard
        width={220}
        image={item.images[0]}
        title={item.title}
        description={item.caption}
        onEdit={() => {
          nav('/activities/' + item.id);
        }}
        name="Activity Feed"
        disabled={isLoading}
        onDeleteClick={() => {
          mutate();
        }}
      />
    </Grid>
  );
};

export default UserActivitiesSection;
