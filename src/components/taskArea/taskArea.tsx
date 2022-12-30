import React from 'react';
import {
  Grid,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { TaskCounter } from '../taskCounter/taskCounter';
import { Task } from '../task/task';
import { useQuery } from '@tanstack/react-query';
import { sendApiRequest } from '../helpers/sendApiRequest';
import { ITask } from '../task/interfaces/ITask';
import { Status } from '../createTaskForm/enums/Status';

export const TaskArea = () => {
  const { error, isLoading, data, refetch } = useQuery(
    ['tasks'],
    async () => {
      return await sendApiRequest<ITask[]>(
        'http://localhost:3200/tasks',
        'GET',
      );
    },
  );
  console.log(data);

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>
          Status Of Your Tasks As On{' '}
          {format(new Date(), 'PPPP')}
        </h2>
      </Box>
      <Grid
        container
        display="flex"
        justifyContent="center"
      >
        <Grid
          item
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          md={10}
          xs={12}
          mb={8}
        >
          <TaskCounter />
          <TaskCounter />
          <TaskCounter />
        </Grid>
        <>
          {error && (
            <Alert severity="error">
              There was an error fetching your tasks
            </Alert>
          )}

          {!error &&
            Array.isArray(data) &&
            data.length === 0 && (
              <Alert severity="warning">
                You do not have any tasks created yet.
              </Alert>
            )}
        </>
        <Grid
          item
          display="flex"
          flexDirection="column"
          xs={10}
          md={8}
        >
          {isLoading ? (
            <LinearProgress />
          ) : (
            Array.isArray(data) &&
            data.length >= 0 &&
            data.map((t, index) => {
              return (
                (t.status === Status.todo ||
                  t.status === Status.inProgress) ? (
                  <Task
                    key={index + t.priority}
                    id={t.id}
                    title={t.title}
                    date={new Date(t.date)}
                    description={t.description}
                    priority={t.priority}
                    status={t.status}
                  />
                ) : (false)
              );
            })
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
