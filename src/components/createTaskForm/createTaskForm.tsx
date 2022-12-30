import React, { FC, ReactElement, useState, useEffect, useContext } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Alert,
  AlertTitle,
  LinearProgress,
} from '@mui/material';
import { Priority } from './enums/Priority';
import { Status } from './enums/Status';
import { TaskTitleField } from './_taskTitleField';
import { TaskDescriptionField } from './_taskDescription';
import { TaskDateField } from './_taskDateField';
import { TaskSelectField } from './_taskSelectField';
import { useMutation } from '@tanstack/react-query';
import { sendApiRequest } from '../helpers/sendApiRequest';
import { ICreateTask } from '../taskArea/interfaces/ICreateTask';
import { TaskStatusChangedContext } from '../../context';

export const CreateTaskForm: FC = (): ReactElement => {
  const [title, setTitle] = useState<string | undefined>(
    undefined,
  );
  const [description, setDescription] = useState<
    string | undefined
  >(undefined);
  const [date, setDate] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<string>(Status.todo);
  const [priority, setPriority] = useState<string>(
    Priority.normal,
  );
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  const tasksUpdatedContext = useContext(
    TaskStatusChangedContext, 
  );

  const createTaskMutation = useMutation(
    (data: ICreateTask) => 
      sendApiRequest(
        'http://localhost:3200/tasks',
        'POST',
        data,
      ),
  );

  function createTaskHandler() {
    if (!title || !date || !description) {
      return;
    }

    const task: ICreateTask = {
      title,
      description,
      date: date.toString(),
      status,
      priority,
    };
    createTaskMutation.mutate(task);
  }
  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      setShowSuccess(true);
      tasksUpdatedContext.toggle();
    }
    const successTimeout = setTimeout(() => {
      setShowSuccess(false);
    }, 7000);

    return () => {
      clearTimeout(successTimeout)
    }
  }, [createTaskMutation.isSuccess]) //listen to teh isSuccess

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width="100%"
      px={4}
      my={6}
    >
      {showSuccess && <Alert
        severity="success"
        sx={{ width: '100%', marginBottom: '16px' }}
      >
        <AlertTitle>Success</AlertTitle>
        The task has been created successfully
      </Alert>}
      <Typography mb={2} component="h2" variant="h6">
        Create A Task
      </Typography>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <TaskTitleField
          onChange={(e) => setTitle(e.target.value)}
          disabled={createTaskMutation.isLoading}
        />
        <TaskDescriptionField
          onChange={(e) => setDescription(e.target.value)}
          disabled={createTaskMutation.isLoading}
        />
        <TaskDateField
          value={date}
          onChange={() => setDate(date)}
          disabled={createTaskMutation.isLoading}
        />
        <Stack
          sx={{ width: '100%' }}
          direction="row"
          spacing={2}
          py={2}
        >
          <TaskSelectField
            label="Status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={createTaskMutation.isLoading}
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
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={createTaskMutation.isLoading}
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
        {createTaskMutation.isLoading && <LinearProgress />}
        
        <Button disabled={
            !title ||
            !description ||
            !date ||
            !status ||
            !priority
          } variant="contained" size="large" onClick={createTaskHandler} fullWidth>
          Create A Task
        </Button>
      </Stack>
    </Box>
  );
};
