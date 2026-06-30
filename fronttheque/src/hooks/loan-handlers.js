import { useCallback, useState, useEffect } from 'react';
import config from 'src/utils/config';
import { addDays, subDays, isSameDay, isWithinInterval } from 'date-fns';
import { useAuth } from './use-auth';
import { toast } from 'react-toastify';
import { useNotification } from 'src/contexts/notification-context';
import { getCookie } from '../utils/csrf';


export const useTransactionHandlers = (props) => {
    let transactionId = props;
    const auth = useAuth();
    const user = auth.user;
    const { addNotification } = useNotification();
    const [transactionData, setTransactionData] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isBorrower, setIsBorrower] = useState(false);
    const [isUserOwner, setIsUserOwner] = useState(false);
    const [authorization, setAuthorization] = useState(false);
    
    useEffect(()=>{
        if(transactionData){
            const valid = user && (user.user_id === transactionData.borrower ||
                user.user_id === transactionData.owner_details.user_id ||
                user.is_staff) ;
            setAuthorization(valid);

            const validOwner = user && (user.user_id === transactionData.owner_details.user_id);
            setIsOwner(validOwner);

            const validBorrower = user && (user.user_id === transactionData.borrower);
            setIsBorrower(validBorrower);

            const userIsOwner = user && (transactionData.owner_details.user_id === user.user_id);
            setIsUserOwner(userIsOwner);
        }
    }, [user, transactionData]);

    const notifyInvolvedParties = useCallback((data) => {
        const { owner_user_id, borrower_id, ownerMessage, borrowerMessage, priority, title, loan, to_notify } = data;
        const { owner_priority, borrower_priority } = priority;
        if (to_notify === 'cancel' || to_notify === 'all') {
          const ownerNotification = {
            message: ownerMessage,
            notificationType: 'Event',
            user: owner_user_id,
            priority: owner_priority,
            title: title,
            transaction_id: loan
          };
          addNotification(ownerNotification);

        }
        if (to_notify === 'approve' || to_notify === 'reject' || to_notify === 'closed' || to_notify === 'all'){
          const borrowerNotification = {
            message: borrowerMessage,
            notificationType: 'Event',
            user: borrower_id,
            priority: borrower_priority,
            title: title,
            transaction_id: loan
          };
          addNotification(borrowerNotification);
        }

    }, [addNotification]);

    const handleTransactionAction = async (transactionId, message, priority, title,type) => {
        try {
            const {genericMessage, ownerMessage , borrowerMessage} = message;
            const csrftoken = getCookie('csrftoken');
            const response = await fetch(`${config.apiUrl}/transactions/${type}/${transactionId}/`, {
                method: 'PUT',
                credentials:"include",
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                })
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                const decodeResponse = JSON.parse(errorMessage);
                toast.error(decodeResponse.message);
            } else {
                const data = await response.json();
                toast.success(genericMessage);

                notifyInvolvedParties({
                    borrower_id: transactionData.borrower_details.user_id,
                    owner_user_id: transactionData.owner_details.user_id,
                    ownerMessage: ownerMessage,
                    borrowerMessage: borrowerMessage,
                    priority: priority,
                    title: title,
                    loan: transactionId,
                    to_notify:type
                });
    
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch (error) {
            toast.error(`Error: ${error}`);
        }
    };

    const OnApproveClick = async () => {
        const type = "approve"
        const genericMessage = 'Transaction approved successfully!';
        const priority = {
            owner_priority: isUserOwner ? "Low" : "High",
            borrower_priority: isUserOwner ? "Low" : "High"
        }
        const title = "Transaction Approval";
        const ownerMessage = `You approved the transaction: ${transactionData.material_details.title} by 
                ${transactionData.borrower_details.first_name} ${transactionData.borrower_details.last_name}.`;
        const borrowerMessage = `Your request to borrow: ${transactionData.material_details.title} was approved.`;
        let message = {genericMessage, ownerMessage , borrowerMessage}
        await handleTransactionAction(transactionId, message, priority, title,type);
    };

    const OnRejectClick = async () => {
        const type = "reject"
        const priority = {
            owner_priority: isUserOwner ? "Low" : "Medium",
            borrower_priority: isUserOwner ? "Low" : "Medium"
        }
        const title = "Transaction Rejection";
        const genericMessage = 'Transaction rejected successfully!';
        const ownerMessage = `You rejected the transaction: ${transactionData.material_details.title} by 
                ${transactionData.borrower_details.first_name} ${transactionData.borrower_details.last_name}.`;
        const borrowerMessage = `Your request to borrow: ${transactionData.material_details.title} was rejected.`;
        let message = {genericMessage, ownerMessage , borrowerMessage}
        await handleTransactionAction(transactionId, message, priority, title,type);
    };

    const OnCancelClick = async () => {
        const type = "cancel"
        const priority = {
            owner_priority: isUserOwner ? "Medium" : "Low",
            borrower_priority: isUserOwner ? "Low" : "Medium"
        }
        const title = "Transaction Cancellation";
        const genericMessage = 'Transaction cancelled successfully!';
        const ownerMessage = `Request Cancelled: ${transactionData.material_details.title} by 
                ${transactionData.borrower_details.first_name} ${transactionData.borrower_details.last_name}.`;
        const borrowerMessage = `You cancelled your request to borrow: ${transactionData.material_details.title}.`;
        let message = {genericMessage, ownerMessage , borrowerMessage}
        await handleTransactionAction(transactionId, message, priority, title,type);
    };

    const OnReturnClick = async () => {
      const type = "closed"
        const priority = {
            owner_priority: isUserOwner ? "Medium" : "Low",
            borrower_priority: isUserOwner ? "Low" : "Medium"
        }
        const title = "Material Return";
        const genericMessage = 'Transaction returned successfully!';
        const ownerMessage = `Your material: ${transactionData.material_details.title} was returned by 
                ${transactionData.borrower_details.first_name} ${transactionData.borrower_details.last_name}.`;
        const borrowerMessage = `You returned the material: ${transactionData.material_details.title}.`;
        let message = {genericMessage, ownerMessage , borrowerMessage}
        await handleTransactionAction(transactionId, message, priority, title,type);
    };

    useEffect(() => {
        if (transactionId) {
            fetch(`${config.apiUrl}/transactions/details/${transactionId}`, {
              method: 'GET',
              credentials: 'include',
            })
                .then(response => response.json())
                .then(data => {
                    setTransactionData(data[0]);
                })

                .catch(error => console.error('Error fetching data:', error));
        }
    }, [transactionId]);


    return {
        transactionData,
        user,
        authorization,
        isOwner,
        isBorrower,
        OnApproveClick,
        OnRejectClick,
        OnCancelClick,
        OnReturnClick
    };
}