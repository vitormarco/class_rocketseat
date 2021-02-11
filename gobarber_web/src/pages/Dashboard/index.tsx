import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { isToday, format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiClock, FiPower } from 'react-icons/fi';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

  const { signOut, user } = useAuth();
  const { addToast } = useToast();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const disableDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });
    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => format(selectedDate, "'Dia' dd 'de' MMMM", {
    locale: ptBR,
  }), [selectedDate]);

  const showToday = useMemo(() => isToday(selectedDate) && (<span>Hoje</span>), [selectedDate]);

  const selectedWeekDay = useMemo(() => format(selectedDate, 'cccc', { locale: ptBR }), [selectedDate]);

  // eslint-disable-next-line max-len
  const morningAppointments = useMemo(() => appointments.filter((appointment) => parseISO(appointment.date).getHours() < 12), [appointments]);

  // eslint-disable-next-line max-len
  const afternoonAppointments = useMemo(() => appointments.filter((appointment) => parseISO(appointment.date).getHours() >= 12), [appointments]);

  const getMonthAvailability = useCallback(async () => {
    try {
      const { data } = await api.get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      });

      setMonthAvailability(data);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Ocorreu um erro ao buscar os dias disponiveis',
        description: err.response.data.message,
      });
    }
  }, [currentMonth, user.id, addToast]);

  const getAppointmentInDate = useCallback(async () => {
    try {
      const { data } = await api.get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      });
      const appointmentsFormatted = data.map((appointment) => ({
        ...appointment,
        hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
      }));

      setAppointments(appointmentsFormatted);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Ocorreu um erro ao buscar os agendamentos do dia',
        description: error.response?.data?.message,
      });
    }
  }, [selectedDate, addToast]);

  useEffect(() => {
    getMonthAvailability();
  }, [getMonthAvailability]);

  useEffect(() => {
    getAppointmentInDate();
  }, [getAppointmentInDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {showToday}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://lh3.googleusercontent.com/ogw/ADGmqu8hAaDeKhmzMfLWsQuxY698UipEFE0Oj8mEB6fMTA=s32-c-mo"
                alt="Vítor Marco"
              />
              <strong>Vítor Marco</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
