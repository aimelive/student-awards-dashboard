import { Grid } from '@mui/material';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import ChooseFileImage from 'ui-component/ChooseFileImage';
import DataWidget from 'ui-component/DataWidget';
import ItemCard from 'ui-component/ItemCard';
import SubmitFormButton from 'ui-component/SubmitFormButton';
import TextInput, { SelectInput } from 'ui-component/TextInput';
import TitleAndSidebar from 'ui-component/TitleAndSidebar';
import { Fetcher } from 'utils/api';
import { compareObj, seasons, talents, toastMessage } from 'utils/helpers';
import * as Yup from 'yup';

const UserAwardsSection = ({ awards, profile, onAdded, onUpdated, onDelete }) => {
  //
  const scriptedRef = useScriptRef();
  //
  const [image, setImage] = useState(null);
  //
  const [editingAward, setEditingAward] = useState(null);
  //
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingAward(null);
  };

  useEffect(() => {
    if (editingAward) {
      setImage(editingAward.featuredPhoto);
    } else {
      setImage(null);
    }
  }, [editingAward]);

  return (
    <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
      <TitleAndSidebar
        title="Awards"
        drawerTitle={editingAward ? 'Edit Award' : 'Give Award'}
        openSidebar={openModal}
        onOpenSidebar={handleOpenModal}
        onCloseSidebar={handleCloseModal}
        customTitle={true}
      >
        <Formik
          initialValues={{
            title: editingAward?.title || '',
            caption: editingAward?.caption || '',
            seasonName: editingAward?.seasonName || 'SEASON_3',
            category: editingAward?.category || 'Singer'
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().min(20).max(100).required('Title is required'),
            caption: Yup.string().min(50).max(300).required('Recognition text is required'),
            seasonName: Yup.string()
              .oneOf(
                seasons.map((season) => season.value),
                'Invalid season'
              )
              .required('Season is required'),
            category: Yup.string()
              .oneOf(
                talents.map((talent) => talent.value),
                'Invalid category'
              )
              .required('Category is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                if (!image) {
                  throw new Error('Please add a <b>featured photo</b> on this award.');
                }
                if (editingAward) {
                  const newObj = compareObj(editingAward, {
                    ...values,
                    image: image != editingAward?.featuredPhoto ? image : undefined,
                    submit: undefined
                  });

                  if (!Object.keys(newObj).length) {
                    throw new Error('No changes made.');
                  }
                  const award = await Fetcher.patch('awards/' + editingAward?.id, newObj);
                  onUpdated(award);
                  toastMessage(`Award has updated succesfully. ${award?.title}`);
                } else {
                  const award = await Fetcher.post('awards', {
                    ...values,
                    userProfileId: profile?.id,
                    submit: undefined,
                    image
                  });
                  onAdded(award);
                  toastMessage(`<b>@${profile?.username}</b> has given new award. 🎉 <b>${award.title}</b>`);
                }

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
                  rows={5}
                  name="caption"
                  label="Recognition Text"
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
                <SelectInput
                  items={talents}
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  name="category"
                  label="Category"
                />
                <ChooseFileImage selected={image} title="Featured Photo" onSelect={(selected) => setImage(selected)} />
                <SubmitFormButton title={editingAward ? 'Edit Award' : 'Give Award'} errors={errors} isSubmitting={isSubmitting} />
              </form>
            );
          }}
        </Formik>
      </TitleAndSidebar>
      <DataWidget
        title="Awards"
        isEmpty={!awards?.length}
        customEmptyMessage="There are no awards associated with this user, create a new one by clicking add button above."
      >
        <Grid container spacing={2}>
          {awards?.map((item, index) => {
            return (
              <AwardCard
                item={item}
                key={index}
                onEdit={() => {
                  setEditingAward(item);
                  handleOpenModal();
                }}
                onDelete={onDelete}
              />
            );
          })}
        </Grid>
      </DataWidget>
    </Grid>
  );
};

const AwardCard = ({ item, onEdit, onDelete }) => {
  const { isLoading, mutate } = useMutation({
    mutationFn: () => Fetcher.delete('awards/' + item.id),
    onSuccess: (award) => {
      toastMessage(`Award <b>${award.title}</b> has removed succesfully`, { isWarning: true });
      onDelete(award);
    },
    onError: (error) => {
      toastMessage(error.message, { isError: true });
    }
  });
  return (
    <Grid item={true} xs={12} sm={6}>
      <ItemCard
        label={item.seasonName.replaceAll('_', ' ')}
        image={item.featuredPhoto}
        title={item.title}
        onEdit={onEdit}
        description={item.caption}
        color="secondary"
        name="Award"
        disabled={isLoading}
        onDeleteClick={() => {
          mutate();
        }}
      />
    </Grid>
  );
};

export default UserAwardsSection;
