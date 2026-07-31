import { useRouter } from 'next/router';
import { useCallback, useState, useEffect } from 'react';
import config from 'src/utils/config';
import { formatDate } from 'src/utils/get-formatted-date';
import { useNotification } from 'src/contexts/notification-context';
import { useAuth } from './use-auth';
import { getCookie } from '../utils/csrf';


export const useLoanDetailHandlers = (data) => {
    const router = useRouter();
    const user = useAuth().user;
    const [formattedDate, setFormattedDate] = useState(null);
    const [daysLeft, setDaysLeft] = useState('');
    const [enableEdit, setEnableEdit] = useState(false);
    const [editableRow, setEditableRow] = useState(null);
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({
        location: '',
        loan_quantity:null,
    });
    const [message, setMessage] = useState({
        status: null,
        value: ''
    });


    const handleChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value
        }));
    };

    useEffect(() => {
        if (data) {
            let enableStatus = [
                'Borrowed',
                'Booked',
                'Pending Validation',
                'Overdue'
            ];
            if (enableStatus.includes(data.loan_status))
                setEnableEdit(true);
        }
    }, [data]);


    const handleEdit = (key) => {
        setEditableRow(key);
    };

    const handleSave = () => {
        setEditableRow(null);
    };

    const checkValidDuration = useCallback(async () => {
        if (formData.duration > data.material_details.duration) {
            setMessage({
                status: "error",
                value: `The new loan term should be less than or equal to ${data.material_details.duration} days.`
            });
            return false;
        }
        return true;
    }, [formData, data.material_details.duration]);

    const notifyInvolvedParties = useCallback((notificationData) => {
      if (notificationData?.is_user_owner){
        //Notify the requestee
        addNotification({
            message: `The owner updated the duration of the transacted material: ${notificationData?.material_title}`,
            notificationType: 'General',
            priority: 'Low',
            title: 'loan Update',
            user: notificationData.borrower_id,
            loan_id: notificationData.loan,
        });
      }
      else {
        //notifying the owner
        addNotification({
          message: `The borrower updated the location of the transacted material: ${notificationData?.material_title}`,
          notificationType: 'General',
          priority: 'Low',
          title: 'loan Update',
          user: notificationData.owner_user_id,
          loan_id: notificationData.loan
        });
      }
    }, [addNotification]);

    useEffect(() => {
        if (data) {
            const formattedDate = formatDate(data.loan_date);
            setFormattedDate(formattedDate);

            setFormData((prevData) => ({
                ...prevData,
                duration: data.duration,
                location: data.location,
                loan_quantity: data.loan_quantity
            }));
        }
    }, [data]);

    const handleSaveChanges = useCallback(
        async (e) => {
            e.preventDefault();
            formData.duration = parseInt(formData.duration);
            await checkValidDuration().then(async (result) => {
                if (result) {
                    try {
                        const csrftoken = getCookie('csrftoken');
                        const response = await fetch(`${config.apiUrl}/loans/${data.loan_id}/`, {
                            method: 'PUT',
                            headers: {
                                'X-CSRFToken': csrftoken,
                                'Content-Type': 'application/json',
                            },
                            credentials:'include',
                            body: JSON.stringify(formData),
                        });

                        if (!response.ok) {
                            const errorMessage = await response.text();
                            setMessage({
                                status: 'error',
                                value: errorMessage
                            });
                        } else {
                            const responseData = await response.json();

                            setMessage({
                                status: 'success',
                                value: 'loan updated successfully!'
                            });

                            notifyInvolvedParties({
                                material_title: data.material_details.title,
                                borrower_id: data.borrower_details.user_id,
                                borrower_name: `${data.borrower_details.first_name} ${data.borrower_details.last_name}`,
                                owner_user_id: data.owner_details.user_id,
                                is_user_owner: user.user_id === data.owner_details.user_id,
                                is_staff: user.is_staff,
                                loan: data.loan_id
                            });

                            setTimeout(() => {
                                window.location.reload();
                            }, 1000); //maybe there's a better way?
                        }

                    } catch (error) {
                        setMessage({
                            status: 'error',
                            value: `Error trying to submit loan: ${error}`
                        });
                    }
                }
            });

        });

    const handleDelete = useCallback(
        async (e) => {
            e.preventDefault();
            const csrftoken = getCookie('csrftoken');
            try {
                const response = await fetch(`${config.apiUrl}/loans/${data.loan_id}/`, {
                    method: 'DELETE',
                    credentials:'include',
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    let decodeResponse = JSON.parse(errorMessage);
                    setMessage({
                        status: 'error',
                        value: decodeResponse.message
                    });
                } else {
                    const data = await response.json();
                    setMessage({
                        status: 'success',
                        value: 'Record deleted successfully!'
                    });

                    setTimeout(() => {
                        router.push('/myloans');
                        window.location.reload();
                    }, 3000); //maybe there's a better way?
                }

            } catch (error) {
                setMessage({
                    status: 'error',
                    value: `Error trying to delete loan: ${error}`
                });
            }
        }, [formData, data.loan_id, router]);

    return {
        formattedDate,
        daysLeft,
        editableRow,
        formData,
        message,
        handleChange,
        handleEdit,
        handleSave,
        handleSaveChanges,
        handleDelete,
        enableEdit
    };
};