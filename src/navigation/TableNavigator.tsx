import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TableIndexScreen from 'table/TableIndexScreen';
import ReservationManagerScreen from 'table/ReservationManagerScreen';

import { Reservation } from 'types/reservation';

export type TableStackParamList = {
  TableIndex:
    | {
        reservation?: Reservation;
        onPressAssignTable?: (tableIds: number[]) => Promise<void>;
      }
    | undefined;
  TableManager: undefined;
};

const Stack = createNativeStackNavigator<TableStackParamList>();

const TableNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="TableIndex">
      <Stack.Screen name="TableIndex" component={TableIndexScreen} />
      <Stack.Screen name="TableManager" component={ReservationManagerScreen} />
    </Stack.Navigator>
  );
};

export default TableNavigator;
