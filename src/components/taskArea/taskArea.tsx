import React, { useContext, useEffect} from 'react';
import {
  Grid,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { TaskCounter } from '../taskCounter/taskCounter';
import { Task } from '../task/task';
import { useQuery, useMutation } from '@tanstack/react-query';
import { sendApiRequest } from '../helpers/sendApiRequest';
import { Status } from '../createTaskForm/enums/Status';
import { IUpdateTask } from '../createTaskForm/interfaces/IUpdateTask';
import { countTasks } from './helpers/countTasks';
import { ITaskApi } from './interfaces/ITaskApi';
import { TaskStatusChangedContext } from '../../context';

export const TaskArea = () => {
  const tasksUpdatedContext = useContext(TaskStatusChangedContext);
  const { error, isLoading, data, refetch } = useQuery(
    ['tasks'],
    async () => {
      return await sendApiRequest<ITaskApi[]>(
        'http://localhost:3200/tasks',
        'GET',
      );
    },
  );

  const updateTaskMutation = useMutation (
    (data:IUpdateTask) => sendApiRequest(
      'http://localhost:3200/tasks',
        'PUT',
        data
    )
  );

  useEffect(()=> {
    refetch();
  }, [tasksUpdatedContext.updated]);

  useEffect(()=> {
    if (updateTaskMutation.isSuccess) {
      tasksUpdatedContext.toggle();
    }
  }, [updateTaskMutation.isSuccess]);

  function onStatusChangeHandler(e:React.ChangeEvent<HTMLInputElement>, id:string) {
    updateTaskMutation.mutate({
      id,
      status: e.target.checked ? Status.inProgress : Status.todo
    })
  }

  function markCompleteHandler(e:
    | React.MouseEvent<HTMLButtonElement>
    | React.MouseEvent<HTMLAnchorElement>, id:string) {
    updateTaskMutation.mutate({
      id,
      status: Status.completed
    })
  }

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
          <TaskCounter status={Status.todo} count={data ? countTasks(data, Status.todo) : undefined}/>
          <TaskCounter status={Status.inProgress} count={data ? countTasks(data, Status.inProgress) : undefined}/>
          <TaskCounter status={Status.completed} count={data ? countTasks(data, Status.completed) : undefined}/>
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
                    onStatusChange={onStatusChangeHandler}
                    onClick={markCompleteHandler}
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
