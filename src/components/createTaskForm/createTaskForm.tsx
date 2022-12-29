import React, { FC, ReactElement } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Priority } from './enums/Priority';
import { Status } from './enums/Status';
import { TaskTitleField } from './_taskTitleField';
import { TaskDescriptionField } from './_taskDescription';
import { TaskDateField } from './_taskDateField';
import { TaskSelectField } from './_taskSelectField';

export const CreateTaskForm: FC = (): ReactElement => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width="100%"
      px={4}
      my={6}
    >
      <Typography mb={2} component="h2" variant="h6">
        Create A Task
      </Typography>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <TaskTitleField />
        <TaskDescriptionField />
        <TaskDateField />
      </Stack>
      <Stack
        sx={{ width: '100%' }}
        direction="row"
        spacing={2}
        py={2}
      >
        <TaskSelectField
          label="Status"
          name="status"
          items={[
            {
              value: Status.todo,
              label: Status.todo.toUpperCase(),
            },
            {
              value: Status.inProgress,
              label: Status.inProgress.toUpperCase(),
            },
          ]}
        ></TaskSelectField>
        <TaskSelectField
          label="Priority"
          name="priority"
          items={[
            {
              value: Priority.low,
              label: Priority.low,
            },
            {
              value: Priority.normal,
              label: Priority.normal,
            },
            {
              value: Priority.high,
              label: Priority.high,
            },
          ]}
        ></TaskSelectField>
      </Stack>
    </Box>
  );
};
