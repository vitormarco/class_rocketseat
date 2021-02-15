import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { Alert } from 'react-native';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
} from './styles';

import { Provider } from '../Dashboard';
import api from '../../services/api';

interface RouteParams {
  providerId: string;
}

const CreateAppointment: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();

  const { providerId } = useMemo(() => route.params as RouteParams, [
    route.params,
  ]);

  const getProvidersList = useCallback(async () => {
    try {
      const { data } = await api.get('providers');
      setProviders(data);
    } catch (err) {
      Alert.alert(
        'Ocorreu um erro ao buscar os Prestadores de serviço',
        err?.response?.data?.message,
      );
    }
  }, []);

  useEffect(() => {
    getProvidersList();
  }, [getProvidersList]);

  const navigateBack = useCallback(() => goBack(), [goBack]);

  console.log(providerId);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
    </Container>
  );
};

export default CreateAppointment;
