import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Card,
  CircularProgress,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import { IconMoodEmpty, IconTrash, IconUserPlus } from '@tabler/icons';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import UserActivitiesSection from 'sections/activity/UserActivitiesSection';
import UserAwardsSection from 'sections/award/UserAwardsSection';
import UserPerformancesSection from 'sections/performance/UserPerformancesSection';
import ChooseFileImage from 'ui-component/ChooseFileImage';
import DataWidget from 'ui-component/DataWidget';
import ModalDialog from 'ui-component/ModalDialog';
import SubmitFormButton from 'ui-component/SubmitFormButton';
import TextInput from 'ui-component/TextInput';
import TitleAndSidebar from 'ui-component/TitleAndSidebar';
import { Fetcher } from 'utils/api';
import { compareObj, toastMessage } from 'utils/helpers';
import * as Yup from 'yup';

const UserDetailsPage = () => {
  //
  const clientQuery = useQueryClient();
  const { id } = useParams();
  const { data: user, isLoading, error } = useQuery({ queryKey: ['users', id], queryFn: () => Fetcher.get('users/' + id), retry: false });
  //
  const scriptedRef = useScriptRef();

  const [openSidebar, setOpenSidebar] = useState(false);

  const onOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const onCloseSidebar = () => {
    setOpenSidebar(false);
  };

  //
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  //
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (user?.profile) {
      setImage(user?.profile?.profilePic);
    }
  }, [user]);
  //
  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: () => Fetcher.delete('profile/' + user?.profile?.id),
    onSuccess: () => {
      toastMessage(`User profile has deleted successfully`);
      clientQuery.setQueryData(['users', id], { ...user, profile: null });
    },
    onError(error) {
      toastMessage(error.message, { isError: true });
    }
  });

  return (
    <DataWidget title="User account" isLoading={isLoading} isError={error}>
      <TitleAndSidebar
        title={`${user?.firstName} ${user?.lastName}`}
        drawerTitle={user?.profile ? 'Update Profile' : 'Create Profile'}
        openSidebar={openSidebar}
        onOpenSidebar={onOpenSidebar}
        onCloseSidebar={onCloseSidebar}
      >
        <Formik
          initialValues={{
            username: user?.profile?.username || '',
            phoneNumber: user?.profile?.phoneNumber || '',
            bio: user?.profile?.bio || ''
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().min(5).max(20).required('User name is required'),
            phoneNumber: Yup.number('Invalid phone number').optional(),
            bio: Yup.string().min(20).max(300).required('Bio is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                if (!image) {
                  throw new Error('Please select a profile picture');
                }
                if (user?.profile) {
                  const newObj = compareObj(user?.profile, {
                    ...values,
                    image: image != user?.profile?.profilePic ? image : undefined,
                    phoneNumber: values.phoneNumber || null,
                    submit: undefined
                  });

                  if (!Object.keys(newObj).length) {
                    throw new Error('No changes made.');
                  }
                  const profile = await Fetcher.patch('profile/' + user?.id, newObj);
                  clientQuery.setQueryData(['users', id], { ...user, profile });
                  toastMessage('Profile information has updated successfully.');
                } else {
                  const profile = await Fetcher.post('profile/' + user?.id, {
                    ...values,
                    phoneNumber: values.phoneNumber || undefined,
                    submit: undefined,
                    image
                  });
                  clientQuery.setQueryData(['users', id], { ...user, profile });
                  toastMessage('Profile information has created successfully.');
                }

                setSubmitting(false);
                setStatus({ success: true });

                onCloseSidebar();
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
                  name="username"
                  label="Username"
                />
                <TextInput
                  type="tel"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  name="phoneNumber"
                  label="Phone Number"
                />
                <TextInput
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  multiline={true}
                  rows={5}
                  name="bio"
                  label="Bio"
                />
                <ChooseFileImage selected={image} title="Profile Picture" onSelect={(selected) => setImage(selected)} />
                <SubmitFormButton title={user?.profile ? 'Update Profile' : 'Create Profile'} errors={errors} isSubmitting={isSubmitting} />
              </form>
            );
          }}
        </Formik>
      </TitleAndSidebar>
      {!user?.profile && (
        <Card sx={{ p: 4 }} component={Stack} justifyContent="center" alignItems="center" spacing={1.5}>
          <IconMoodEmpty size={50} />
          <Typography fontSize={20}>
            Member{' '}
            <b>
              {user?.firstName} {user?.lastName}
            </b>{' '}
            has no profile yet!
          </Typography>
          <Typography textAlign="center">
            Member with no profile data will not be able to get performances, awards and activities.
            <br />
            Click the button below to add a profile to <b>{user?.email}</b> account.
          </Typography>
          <Button
            variant="contained"
            endIcon={<IconUserPlus size={16} />}
            color="secondary"
            sx={{ borderRadius: 1.4, boxShadow: 'none', color: 'white' }}
            onClick={onOpenSidebar}
          >
            Create Profile
          </Button>
        </Card>
      )}
      {user?.profile && (
        <>
          <Card sx={{ p: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4">Profile Picture: </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Avatar src={user?.profile?.profilePic} sx={{ width: 100, height: 100 }}></Avatar>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4">Username: </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>@{user?.profile?.username}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4">Bio: </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>{user?.profile?.bio}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4">Phone Number: </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>{user?.profile?.phoneNumber || '(No phone number)'}</Typography>
              </Grid>
            </Grid>
          </Card>
          <Grid container spacing={5}>
            <UserPerformancesSection
              performances={user?.profile?.performances}
              profile={user?.profile}
              onAdded={(performance) => {
                clientQuery.setQueryData(['users', id], {
                  ...user,
                  profile: { ...user.profile, performances: [performance, ...user.profile.performances] }
                });
              }}
              onDelete={(performance) => {
                clientQuery.setQueryData(['users', id], {
                  ...user,
                  profile: { ...user.profile, performances: user.profile.performances.filter((item) => item.id !== performance.id) }
                });
              }}
            />
            <UserAwardsSection
              awards={user?.profile?.awards}
              profile={user?.profile}
              onAdded={(award) => {
                clientQuery.setQueryData(['users', id], { ...user, profile: { ...user.profile, awards: [award, ...user.profile.awards] } });
              }}
              onUpdated={(award) => {
                clientQuery.setQueryData(['users', id], {
                  ...user,
                  profile: { ...user.profile, awards: user.profile.awards.map((item) => (item.id === award.id ? award : item)) }
                });
              }}
              onDelete={(award) => {
                clientQuery.setQueryData(['users', id], {
                  ...user,
                  profile: { ...user.profile, awards: user.profile.awards.filter((item) => item.id !== award.id) }
                });
              }}
            />
          </Grid>
          <UserActivitiesSection
            activities={user?.profile?.activities}
            profile={user?.profile}
            onAdded={(activity) => {
              clientQuery.setQueryData(['users', id], {
                ...user,
                profile: { ...user.profile, activities: [activity, ...user.profile.activities] }
              });
            }}
            onDelete={(activity) => {
              clientQuery.setQueryData(['users', id], {
                ...user,
                profile: { ...user.profile, activities: user.profile.activities.filter((item) => item.id !== activity.id) }
              });
            }}
          />

          <Stack sx={{ my: 1, mt: 4 }} spacing={2}>
            <Typography variant="h4">Danger Zone</Typography>
            <Alert
              icon={<IconMoodEmpty />}
              severity="error"
              action={
                <Button
                  color="error"
                  size="small"
                  startIcon={isDeleting ? <CircularProgress color="inherit" size={18} /> : <IconTrash size={18} />}
                  variant="contained"
                  sx={{ boxShadow: 0 }}
                  onClick={handleOpenModal}
                  disabled={isDeleting}
                >
                  DELETE
                </Button>
              }
              sx={{ p: 2, px: 3 }}
            >
              <AlertTitle>Delete User</AlertTitle>
              This action cannot be undone, click delete button to delete all user performances, awards and activities —{' '}
              <strong>@{user?.profile?.username}</strong>
            </Alert>
          </Stack>
          <ModalDialog
            title="Delete Profile? 😢"
            subTitle={`Are you sure do you want to delete this profile? Performances, Awards and Activities related to this user will also be deleted.`}
            open={openModal}
            handleClose={handleCloseModal}
            hardWarning={`Damn!😮🥱😱 ${user?.profile?.performances?.length} performances, ${user?.profile?.awards?.length} awards and ${user?.profile?.activities?.length} activities will be removed. Still sure and understand these effects?`}
            handleClickOk={() => {
              mutate();
              handleCloseModal();
            }}
            item={
              <ListItem sx={{ boxShadow: 1, borderRadius: 2, my: 3 }}>
                <ListItemAvatar>
                  <Avatar src={user?.profile?.profilePic} sx={{ color: 'white', fontWeight: 'bold' }}>
                    {user?.firstName.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${user?.firstName} ${user?.lastName}`}
                  secondary={user?.profile?.username ? `@${user?.profile?.username}` : user?.email}
                />
              </ListItem>
            }
          />
        </>
      )}
    </DataWidget>
  );
};

export default UserDetailsPage;
