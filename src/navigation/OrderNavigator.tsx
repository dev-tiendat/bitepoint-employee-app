import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrderDetailScreen from 'order/OrderDetailScreen';
import OrderManagerScreen from 'order/OrderManagerScreen';
import OrderTrackingScreen from 'order/OrderTrackingScreen';

export type OrderStackParamList = {
  OrderManager: undefined;
  OrderTracking: undefined;
  OrderDetail: { orderId: string };
};

const Stack = createNativeStackNavigator<OrderStackParamList>();

const OrderNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'none' }}
      initialRouteName="OrderManager">
      <Stack.Screen name="OrderManager" component={OrderManagerScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
};

export default OrderNavigator;
