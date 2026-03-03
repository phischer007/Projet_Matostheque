import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import config from 'src/utils/config';
import { addDays, subDays, isSameDay, isWithinInterval } from 'date-fns';
import moment from 'moment';
import { useAuth } from 'src/hooks/use-auth';
import { useNotification } from 'src/contexts/notification-context';



export const useNewLoanHandlers = (props) => {
  //State Variables and  their Setters
  const router = useRouter();
  const user = useAuth().user;
  const materialsArray = props.materialsList ? Object.values(props.materialsList) : null;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [events, setEvents] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loanDuration, setLoanDuration] = useState(null);
  const { addNotification } = useNotification();

  const [formErrors, setFormErrors] = useState({
    material: false,
    startDate: false,
    endDate: false,
    location: false
  });

  const [formData, setFormData] = useState({
    material: null,
    loan_date: startDate? startDate : null,
    duration: null,
    borrower: user ? user.user_id : null,
    location: null
  });
  
  const [message, setMessage] = useState({
    status: null,
    value: ''
  });

  //Functions to handle the form submission
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (!endDate || date > endDate) {
      setEndDate(date);
    }
    setFormData((prevState) => ({
      ...prevState,
      loan_date: date
    }));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const isDateStartDisabled = (date) => {
    if (date < subDays(new Date(), 1)) return true;
    return isDataEventDisabled(date);
  };

  const isDateEndDisabled = (date) => {
    if(!selectedMaterial) return false;
    if(!startDate) return false;
    if (date < (startDate + 1)) return true;
    if (date > addDays(startDate, (loanDuration - 1))) return true;
    return isDataEventDisabled(date);
  };

  const isDataEventDisabled = useCallback((date) => {
    if (events) {
      for (let e in events) {
        const item = events[e];
        if (item.loan_status == 'Borrowed' || item.loan_status == 'Overdue' || item.loan_status == 'Booked') {
          let startDate = new Date(item.loan_date);
          let endDate = addDays(startDate, (item.duration - 1))
          if (isSameDay(date, startDate) || isWithinInterval(date, { start: startDate, end: endDate })) return true;
        }
      }
    }
    return false;
  }, [events]
  );

  const handleChange = useCallback(
    (event) => {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const onSelectChange = useCallback(
    (event, values) => {
      if (values) {
        setSelectedMaterial(values);
        setFormData((prevState) => ({
          ...prevState,
          material: values.material_id
        }));

        setLoanDuration(values.loan_duration);

        setMessage({
          status: 'info',
          value: `You can borrow the material up to ${values.loan_duration} days.`
        });

        fetch(`${config.apiUrl}/material/${values.material_id}/events/lite/`)
          .then(response => response.json())
          .then(data => {
            if (data) setEvents(data);
          })
          .catch(error => console.error('Error fetching data:', error));
      }
    }, []
  );

  const calculateDuration = useCallback(() => {
    let start = startDate.setHours(0, 0, 0, 0);
    let end = endDate.setHours(0, 0, 0, 0);
    const differenceDays = (Math.floor((end - start) / (1000 * 60 * 60 * 24))) +1; //Plus one because of the buffer
    return differenceDays;
  },[startDate, endDate]);

  const notifyInvolvedParties = useCallback((data) => {
    const { owner_user_id, borrower_id, borrower_name, material_title, validation, loan } = data;
    let borrowerMessage = validation ? `Your request to borrow: ${material_title} is waiting for approval.` : `You successfully booked the material: ${material_title}.`;
    let ownerMessage = validation ? `You have a new pending request: ${material_title}` : ` ${borrower_name} has booked your material: ${material_title}.`;

    const ownerNotification = {
        message: ownerMessage,
        notificationType: validation ? 'Request Alert' : 'Event',
        user: owner_user_id,
        priority: validation? 'High' : 'Medium',
        title: 'New Request',
        loan: loan
    };

    const borrowerNotification = {
        message: borrowerMessage,
        notificationType: 'General',
        user: borrower_id,
        priority: validation? 'Medium' : 'Low',
        title: 'New Request',
        loan: loan

    };

    if (owner_user_id !== borrower_id) {
        addNotification(ownerNotification);
        addNotification(borrowerNotification);
    } else {
        addNotification({
            message: `You have reserved your material: ${material_title}`,
            notificationType: 'General',
            priority: 'Low',
            title: 'Material Reservation',
            user: owner_user_id,
            loan: loan
        });
    }
}, [addNotification]);


  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const data = formData;
      const formattedDate = moment(data.loan_date, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      data.loan_date = formattedDate;

      // Check if each field is empty and set error state accordingly
      const newErrors = {
        material: data.material === null,
        startDate: data.loan_date === null,
        endDate: endDate === null,
        location: data.location === null 
      };

      setFormErrors(newErrors);

      //Setting the approval_date to today if owner is reserving his own material
      if(user.user_id == selectedMaterial.owner__user_id){
        data.approval_date = new Date().toISOString();
      }

      if (!Object.values(newErrors).some(error => error)) {

        try {
          const response = await fetch(`${config.apiUrl}/loans/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            
            let decodeResponse = JSON.parse(errorMessage);
            // Get the first key
            let [firstKey] = Object.keys(decodeResponse);
            setMessage({
              status: 'error',
              value: `${firstKey} : ${decodeResponse[firstKey]}`
            });

            console.log(decodeResponse[firstKey]);

          } else {
            const data = await response.json();

            notifyInvolvedParties({
              material_title: selectedMaterial.material_title,
              borrower_id: user.user_id,
              borrower_name: user.first_name + " " + user.last_name,
              owner_user_id: selectedMaterial.owner__user_id,
              validation: selectedMaterial.validation,
              loan: data.loan_id
            });

            setTimeout(() => {
              router.push('/myloans');
            }, 2000); //maybe there's a better way?
          }

        } catch (error) {
          setMessage({
            status: 'error',
            value: `Could not borrow. Please verify yor data or try ulteriorly`
          });
        }
      }
    }, [formData, router]);

  //Event handlers on effect
  useEffect(() => {
    if (startDate && endDate) {
      const diffDays = calculateDuration();
      setFormData((prevState) => ({
        ...prevState,
        duration: diffDays
      }));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (props.selectedMaterial) {
      const record = materialsArray.find(item => item.material_id === props.selectedMaterial);

      setSelectedMaterial(record);

      setFormData((prevState) => ({
        ...prevState,
        material: props.selectedMaterial
      }));

      setLoanDuration(record.loan_duration);

      fetch(`${config.apiUrl}/material/${record.material_id}/events/lite/`)
        .then(response => response.json())
        .then(data => {
          if (data) setEvents(data);
        })
        .catch(error => console.error('Error fetching data:', error));

      setMessage({
        status: 'info',
        value: `You can borrow the material up to ${record.loan_duration} days.`
      });
    }
  }, [props.selectedMaterial]);

  return {
    materialsArray,
    startDate,
    endDate,
    formData,
    message,
    handleStartDateChange,
    handleEndDateChange,
    isDateStartDisabled,
    isDateEndDisabled,
    handleChange,
    onSelectChange,
    handleSubmit,
    selectedMaterial,
    formErrors

  };
};