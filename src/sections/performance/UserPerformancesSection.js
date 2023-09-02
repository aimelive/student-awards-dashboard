import { Grid } from '@mui/material';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import ChooseMultipleImages from 'ui-component/ChooseMultipleImages';
import DataWidget from 'ui-component/DataWidget';
import ItemCard from 'ui-component/ItemCard';
import SubmitFormButton from 'ui-component/SubmitFormButton';
import TextInput, { SelectInput } from 'ui-component/TextInput';
import TitleAndSidebar from 'ui-component/TitleAndSidebar';
import { Fetcher } from 'utils/api';
import { seasons, toastMessage } from 'utils/helpers';
import * as Yup from 'yup';

const UserPerformancesSection = ({ performances, profile, onAdded, onDelete }) => {
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
    <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
      <TitleAndSidebar
        title="Performances"
        drawerTitle={'Add Performance'}
        openSidebar={openModal}
        onOpenSidebar={handleOpenModal}
        onCloseSidebar={handleCloseModal}
        customTitle={true}
      >
        <Formik
          initialValues={{
            title: '',
            description: '',
            seasonName: 'SEASON_3'
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
              .matches(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(\?\S+)?$/, 'Invalid YouTube video URL format')
              .required('YouTube video url is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                if (images.length < 3) {
                  throw new Error(images.length ? 'Please add three images at least' : 'Please add images to this performance');
                }
                const performance = await Fetcher.post('performances', {
                  ...values,
                  images: images.map((img) => img.url),
                  userProfileId: profile?.id,
                  submit: undefined
                });
                onAdded(performance);
                toastMessage(`<b>@${profile?.username}</b> has given new performance. 🎉 <b>${performance.title}</b>`);

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
                <ChooseMultipleImages
                  label={'Performance Images'}
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
                <SubmitFormButton title={'Add Performance'} errors={errors} isSubmitting={isSubmitting} />
              </form>
            );
          }}
        </Formik>
      </TitleAndSidebar>
      <DataWidget
        title="Performances"
        isEmpty={!performances?.length}
        customEmptyMessage="There are no performances associated with this user, create a new one by clicking add button above."
      >
        <Grid container spacing={2}>
          {performances?.map((item, index) => {
            return <PerformanceCard key={index} item={item} onDelete={onDelete} />;
          })}
        </Grid>
      </DataWidget>
    </Grid>
  );
};

const PerformanceCard = ({ item, onDelete }) => {
  const nav = useNavigate();

  const { isLoading, mutate } = useMutation({
    mutationFn: () => Fetcher.delete('performances/' + item.id),
    onSuccess: (performance) => {
      toastMessage(`Performance <b>${performance.title}</b> has removed succesfully`, { isWarning: true });
      onDelete(performance);
    },
    onError: (error) => {
      toastMessage(error.message, { isError: true });
    }
  });
  return (
    <Grid item={true} xs={12} sm={6}>
      <ItemCard
        label={item.seasonName.replaceAll('_', ' ')}
        image={item.images[0]}
        title={item.title}
        description={item.description}
        onEdit={() => {
          nav('/performances/' + item.id);
        }}
        name="Performance"
        disabled={isLoading}
        onDeleteClick={() => {
          mutate();
        }}
      />
    </Grid>
  );
};

export default UserPerformancesSection;
