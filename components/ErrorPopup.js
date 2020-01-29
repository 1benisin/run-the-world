import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Button, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Run from '../store/run/model';
import * as appErrorActions from '../store/appError/actions';
import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';

const ErrorPopup = ({ error }) => {
  const dispatch = useDispatch();

  let title = error.title;
  let message = error.message;
  let cancel = null;
  let confirm = (
    <Button onPress={() => dispatch(appErrorActions.clearError())}>Ok</Button>
  );

  switch (error) {
    case Run.TOO_FAR_FROM_START_ERROR:
      confirm = (
        <Button onPress={() => dispatch(appErrorActions.clearError())}>
          Continue Run
        </Button>
      );
      cancel = (
        <Button
          onPress={() => {
            const ignoreError = true;
            dispatch(appErrorActions.clearError());
            dispatch(runActions.stopRun(ignoreError));
          }}
        >
          Stop & Save Run
        </Button>
      );
      break;

    default:
      break;
  }

  return (
    <Portal>
      <Dialog visible={!!error} dismissable={false}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          {cancel}
          {confirm}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({});

export default ErrorPopup;
