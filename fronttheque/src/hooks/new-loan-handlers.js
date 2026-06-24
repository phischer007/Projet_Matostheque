import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import config from 'src/utils/config';
import { addDays, subDays, isSameDay, isWithinInterval } from 'date-fns';
import moment from 'moment';
import { useAuth } from 'src/hooks/use-auth';
import { useNotification } from 'src/contexts/notification-context';
import { getCookie } from '../utils/csrf';
import dayjs from 'dayjs';



export const useNewLoanHandlers = (props) => {
  //State Variables and  their Setters
  const router = useRouter();
  const user = useAuth().user;
  const materialsArray = props.materialsList ? Object.values(props.materialsList) : null;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [events, setEvents] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const { addNotification } = useNotification();
  const [maxDate, setMaxDate] = useState(null);
  const [formation_required, setFormation_required] = useState(null)

  const [formErrors, setFormErrors] = useState({
    material: false,
    startDate: false,
    endDate: false,
    location: false,
    formation_required: false,
  });

  const [formData, setFormData] = useState({
    material: null,
    transaction_date: startDate? startDate : null,
    duration: null,
    borrower: user ? user.user_id : null,
    location: user.laboratory_address,
    message:null,
    transaction_quantity : 1
  });
  
  const [message, setMessage] = useState({
    status: null,
    value: ''
  });

  const handleFormation_required = () => {
    setFormation_required((prevState) => !prevState)
    setFormErrors(prev => ({
      ...prev,
      formation_required: false,
    }));

  }

  //Functions to handle the form submission
  const handleStartDateChange = (date) => {
   let newdate = moment(date).format("YYYY-MM-DD")
    setStartDate(date);
    if (newdate !== "Invalid date"){
      if(selectedMaterial){
        setMaxDate(new Date(date).setDate(new Date(date).getDate()+selectedMaterial.loan_duration-1))
      }
      setFormData({
      ...formData,
      transaction_date: newdate ,
    });
    }else {
      setMaxDate(null)
      setFormData({
      ...formData,
      transaction_date: null ,
    });
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleChange = useCallback(
    (event) => {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleChangeNum = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value.replace(/\D/g, "") // garde seulement les chiffres
    }));
  }, []);

  const handleChangeNumDec = useCallback((event) => {
  const { name, value } = event.target;

  let cleaned = value
    .replace(/[^0-9.]/g, "") // garde chiffres + point
    .replace(/(\..*)\./g, "$1"); // empêche plusieurs points

  setFormData((prev) => ({
    ...prev,
    [name]: cleaned
  }));
}, []);

  const onSelectChange = useCallback(
    (event, values) => {
      setSelectedMaterial(values);
      if (values) {
        if (startDate){
          setMaxDate(new Date(startDate).setDate(new Date(startDate).getDate()+values.loan_duration-1))
        }
        if(endDate && values.type === 'CONSUMABLES'){
          setEndDate(null)
        }
        setFormData((prevState) => ({
          ...prevState,
          material: values.material_id
        }));

        if (values.type === "LAB_SUPPLIES") {
          setMessage({
            status: 'info',
            value: `You can borrow the material up to ${values.loan_duration} days. \n You can borrow  up to ${values.quantity_available}`
          });
        }
        else{
          setMessage({
            status: 'info',
            value: `You can borrow  up to ${values.quantity_available} `
          });
        }

        fetch(`${config.apiUrl}/material/${values.material_id}/events/`,
          {credentials:'include'})
          .then(response => response.json())
          .then(data => {
            if (data) setEvents(data);
          })
          .catch(error => console.error('Error fetching data:', error));
      }
      else {
        setMaxDate(null)
        setMessage(null)
        setEvents(null)
        setFormData((prevState) => ({
          ...prevState,
          material: null
        }));
      }
    }, [endDate, startDate]
  );

  const calculateDuration = useCallback(() => {
    let start = startDate.setHours(0, 0, 0, 0);
    let end = endDate.setHours(0, 0, 0, 0);
    const differenceDays = (Math.floor((end - start) / (1000 * 60 * 60 * 24))) +1; //Plus one because of the buffer
    return differenceDays;
  },[startDate, endDate]);

  const notifyInvolvedParties = useCallback((data) => {
    const { owner_user_id, borrower_id, borrower_name, material_title, validation, loan } = data;
    //The owner receive a notification
    let ownerMessage = validation ? `You have a new pending request: ${material_title}` : ` ${borrower_name} has booked your material: ${material_title}.`;
    const ownerNotification = {
        message: ownerMessage,
        notificationType: validation ? 'Request Alert' : 'Event',
        user: owner_user_id,
        priority: validation? 'High' : 'Medium',
        title: 'New Request',
        transaction_id: loan
    };
    addNotification(ownerNotification);

    // the borrower receive a notification if no validation is needed
    if (validation === false) {
      let borrowerMessage = `You successfully booked the material: ${material_title}.`;
      const borrowerNotification = {
        message: borrowerMessage,
        notificationType: 'General',
        user: borrower_id,
        priority: validation ? 'Medium' : 'Low',
        title: 'New Request',
        transaction_id: loan
      };
      addNotification(borrowerNotification);
    }

}, [addNotification]);


  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const data = formData;

      // Check if each field is empty and set error state accordingly
      const newErrors = {
        material: data.material === null,
        startDate: !(startDate instanceof Date) || isNaN(startDate.getTime()),
        endDate: !(endDate instanceof Date) || isNaN(endDate.getTime()) && (selectedMaterial && selectedMaterial.type === "LAB_SUPPLIES") ,
        location: data.location === null,
        formation_required: formation_required !== true && selectedMaterial && selectedMaterial.is_formation_required === true,
      };

      setFormErrors(newErrors);

      if (!Object.values(newErrors).some(error => error)) {

        try {
          const csrftoken = getCookie('csrftoken');
          const response = await fetch(`${config.apiUrl}/transactions/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
            credentials:'include',
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


          } else {
            const data = await response.json();
            notifyInvolvedParties({
              material_title: selectedMaterial.material_title,
              borrower_id: user.user_id,
              borrower_name: user.first_name + " " + user.last_name,
              owner_user_id: selectedMaterial.user_id,
              validation: selectedMaterial.validation,
              loan: data.transaction_id
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
    }, [formData, formErrors, endDate, selectedMaterial, formation_required, notifyInvolvedParties, user, router]);

  //Event handlers on effect
  useEffect(() => {
    if (startDate && endDate) {
      const diffDays = calculateDuration();
      setFormData((prevState) => ({
        ...prevState,
        duration: diffDays
      }));
    }
  }, [startDate, endDate, calculateDuration]);

  useEffect(() => {
    if (props.selectedMaterial) {
      const record = materialsArray.find(item => item.material_id === props.selectedMaterial);

      setSelectedMaterial(record);

      setFormData((prevState) => ({
        ...prevState,
        material: props.selectedMaterial
      }));


      fetch(`${config.apiUrl}/material/${record.material_id}/events/`,{credentials:'include'})
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
    handleChange,
    onSelectChange,
    handleSubmit,
    selectedMaterial,
    formErrors,
    handleChangeNum,
    handleChangeNumDec,
    maxDate,
    events,
    formation_required,
    handleFormation_required,
  };
};