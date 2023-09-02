import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';

export const SelectInput = ({ items, name, label, touched, errors, handleChange, values }) => {
  return (
    <FormControl fullWidth sx={{ my: 1 }}>
      <InputLabel htmlFor={'outlined-adornment-' + name}>{label}</InputLabel>
      <Select id={'outlined-adornment-' + name} value={values[name]} name={name} onChange={handleChange} label={label}>
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {touched[name] && errors[name] && (
        <FormHelperText error id="standard-weight-helper-text-status-login">
          {errors[name]}
        </FormHelperText>
      )}
    </FormControl>
  );
};

const TextInput = ({ label, name, touched, errors, type = 'text', handleBlur, handleChange, values, multiline, rows }) => {
  const id = label.replaceAll(' ', '-').toLowerCase();
  return (
    <FormControl fullWidth error={Boolean(touched[name] && errors[name])} sx={{ my: 1 }}>
      <InputLabel htmlFor={'outlined-adornment-' + id}>{label}</InputLabel>
      <OutlinedInput
        id={'outlined-adornment-' + id}
        type={type}
        value={values[name]}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        label={label}
        inputProps={{}}
        multiline={multiline}
        rows={rows}
      />
      {touched[name] && errors[name] && (
        <FormHelperText error id={'standard-weight-helper-text-' + id}>
          {errors[name]}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default TextInput;
