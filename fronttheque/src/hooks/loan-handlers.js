import { useCallback, useState, useEffect } from 'react';
import config from 'src/utils/config';
import { addDays, subDays, isSameDay, isWithinInterval } from 'date-fns';
import { useAuth } from './use-auth';
import { toast } from 'react-toastify';
import { useNotification } from 'src/contexts/notification-context';


export const useLoanHandlers = (props) => {
    let loanId = props;
    const auth = useAuth();
    const user = auth.user;
    const { addNotification } = useNotification();
    const [loanData, setLoanData] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isBorrower, setIsBorrower] = useState(false);
    const [isUserOwner, setIsUserOwner] = useState(false);
    const [authorization, setAuthorization] = useState(false);
    
    useEffect(()=>{
        if(loanData){
            const valid = user && (user.user_id === loanData.borrower || 
                user.user_id === loanData.owner_details.user_id || 
                user.is_staff) ;
            setAuthorization(valid);

            const validOwner = user && (user.user_id === loanData.owner_details.user_id);
            setIsOwner(validOwner);

            const validBorrower = user && (user.user_id === loanData.borrower);
            setIsBorrower(validBorrower);

            const userIsOwner = user && (loanData.owner_details.user_id === user.user_id);
            setIsUserOwner(userIsOwner);
        }
    }, [user, loanData]);

    const notifyInvolvedParties = useCallback((data) => {
        const { owner_user_id, borrower_id, ownerMessage, borrowerMessage, priority, title, loan } = data;
        const { owner_priority, borrower_priority } = priority;
        const ownerNotification = {
            message: ownerMessage,
            notificationType: 'Event',
            user: owner_user_id,
            priority: owner_priority,
            title: title,
            loan: loan

        };
        const borrowerNotification = {
            message: borrowerMessage,
            notificationType: 'Event',
            user: borrower_id,
            priority: borrower_priority,
            title: title,
            loan: loan
        };
    
        if (owner_user_id !== borrower_id) {
            addNotification(ownerNotification);
            addNotification(borrowerNotification);
        }

    }, [addNotification]);

    const handleLoanAction = async (loanId, action, dateField, message, priority, title) => {
        try {
            const {genericMessage, ownerMessage , borrowerMessage} = message;
            const response = await fetch(`${config.apiUrl}/loans/${loanId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [dateField]: new Date().toISOString(),
                    ...action
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
                    borrower_id: loanData.borrower_details.user_id,
                    owner_user_id: loanData.owner_details.user_id,
                    ownerMessage: ownerMessage,
                    borrowerMessage: borrowerMessage,
                    priority: priority,
                    title: title,
                    loan: loanId
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
        const action = {};
        const dateField = 'approval_date';
        const genericMessage = 'Loan approved successfully!';
        const priority = {
            owner_priority: isUserOwner ? "Low" : "High",
            borrower_priority: isUserOwner ? "Low" : "High"
        }
        const title = "Loan Approval";
        const ownerMessage = `You approved the loan: ${loanData.material_details.title} by 
                ${loanData.borrower_details.first_name} ${loanData.borrower_details.last_name}.`;
        const borrowerMessage = `Your request to borrow: ${loanData.material_details.title} was approved.`;
        let message = {genericMessage, ownerMessage , borrowerMessage}
        await handleLoanAction(loanId, action, dateField, message, priority, title);
    };

    const OnRejectClick = async () => {
        const action = {};
        const dateField = 'rejection_date';
        const priority = {
            owner_priority: isUserOwner ? "Low" : "Medium",
            borrower_priority: isUserOwner ? "Low" : "Medium"
        }
        const title = "Loan Rejection";
        const genericMessage = 'Loan rejected successfully!';
        const ownerMessage = `You rejected the loan: ${loanData.material_details.title} by 
                ${loanData.borrower_details.first_name} ${loanData.borrower_details.last_name}.`;
        const borrowerMessage = `Your request to borrow: ${loanData.material_details.title} was rejected.`;
        let message = {genericMessage, ownerMessage , borrowerMessage}
        await handleLoanAction(loanId, action, dateField, message, priority, title);
    };

    const OnCancelClick = async () => {
        const action = {};
        const dateField = 'cancellation_date';
        const priority = {
            owner_priority: isUserOwner ? "Medium" : "Low",
            borrower_priority: isUserOwner ? "Low" : "Medium"
        }
        const title = "Loan Cancellation";
        const genericMessage = 'Loan cancelled successfully!';
        const ownerMessage = `Request Cancelled: ${loanData.material_details.title} by 
                ${loanData.borrower_details.first_name} ${loanData.borrower_details.last_name}.`;
        const borrowerMessage = `You cancelled your request to borrow: ${loanData.material_details.title}.`;
        let message = {genericMessage, ownerMessage , borrowerMessage}
        await handleLoanAction(loanId, action, dateField, message, priority, title);
    };

    const OnReturnClick = async () => {
        const action = { is_active: false };
        const dateField = 'return_date';
        const priority = {
            owner_priority: isUserOwner ? "Medium" : "Low",
            borrower_priority: isUserOwner ? "Low" : "Medium"
        }
        const title = "Material Return";
        const genericMessage = 'Loan returned successfully!';
        const ownerMessage = `Your material: ${loanData.material_details.title} was returned by 
                ${loanData.borrower_details.first_name} ${loanData.borrower_details.last_name}.`;
        const borrowerMessage = `You returned the material: ${loanData.material_details.title}.`;
        let message = {genericMessage, ownerMessage , borrowerMessage}
        await handleLoanAction(loanId, action, dateField, message, priority, title);
    };



    useEffect(() => {
        if (loanId) {

            fetch(`${config.apiUrl}/loans/details/${loanId}`)
                .then(response => response.json())
                .then(data => {
                    setLoanData(data[0]);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [loanId]);


    return {
        loanData,
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

// import { useCallback, useState, useEffect } from 'react';
// import config from 'src/utils/config';
// import { addDays, subDays, isSameDay, isWithinInterval } from 'date-fns';
// import { useAuth } from './use-auth';
// import { toast } from 'react-toastify';
// import { useNotification } from 'src/contexts/notification-context';


// export const useLoanHandlers = (props) => {
//     let loanId = props;
//     const auth = useAuth();
//     const user = auth.user;
//     const { addNotification } = useNotification();
//     const [loanData, setLoanData] = useState(null);
//     const [isOwner, setIsOwner] = useState(false);
//     const [isBorrower, setIsBorrower] = useState(false);
//     const [isUserOwner, setIsUserOwner] = useState(false);
//     const [authorization, setAuthorization] = useState(false);
    
//     useEffect(()=>{
//         if(loanData){
//             const valid = user && (user.user_id === loanData.borrower || 
//                 user.user_id === loanData.owner_details.user_id || 
//                 user.is_staff) ;
//             setAuthorization(valid);

//             const validOwner = user && (user.user_id === loanData.owner_details.user_id);
//             setIsOwner(validOwner);

//             const validBorrower = user && (user.user_id === loanData.borrower);
//             setIsBorrower(validBorrower);

//             const userIsOwner = user && (loanData.owner_details.user_id === user.user_id);
//             setIsUserOwner(userIsOwner);
//         }
//     }, [user, loanData]);

//     const notifyInvolvedParties = useCallback((data) => {
//         const { owner_user_id, borrower_id, ownerMessage, borrowerMessage, priority, title, loan } = data;
//         const { owner_priority, borrower_priority } = priority;
//         const ownerNotification = {
//             message: ownerMessage,
//             notificationType: 'Event',
//             user: owner_user_id,
//             priority: owner_priority,
//             title: title,
//             loan: loan

//         };
//         const borrowerNotification = {
//             message: borrowerMessage,
//             notificationType: 'Event',
//             user: borrower_id,
//             priority: borrower_priority,
//             title: title,
//             loan: loan
//         };
    
//         if (owner_user_id !== borrower_id) {
//             addNotification(ownerNotification);
//             addNotification(borrowerNotification);
//         }

//     }, [addNotification]);

//     const handleLoanAction = async (loanId, action, dateField, message, priority, title) => {
//         try {
//             const {genericMessage, ownerMessage , borrowerMessage} = message;
//             const response = await fetch(`${config.apiUrl}/loans/${loanId}/`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     [dateField]: new Date().toISOString(),
//                     ...action
//                 })
//             });
    
//             if (!response.ok) {
//                 const errorMessage = await response.text();
//                 const decodeResponse = JSON.parse(errorMessage);
//                 toast.error(decodeResponse.message);
//             } else {
//                 const data = await response.json();
//                 toast.success(genericMessage);

//                 notifyInvolvedParties({
//                     borrower_id: loanData.borrower_details.user_id,
//                     owner_user_id: loanData.owner_details.user_id,
//                     ownerMessage: ownerMessage,
//                     borrowerMessage: borrowerMessage,
//                     priority: priority,
//                     title: title,
//                     loan: loanId
//                 });
    
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 3000);
//             }
//         } catch (error) {
//             toast.error(`Error: ${error}`);
//         }
//     };

//     const OnApproveClick = async () => {
//         const action = {};
//         const dateField = 'approval_date';
//         const genericMessage = 'Loan approved successfully!';
//         const priority = {
//             owner_priority: isUserOwner ? "Low" : "High",
//             borrower_priority: isUserOwner ? "Low" : "High"
//         }
//         const title = "Loan Approval";
//         const ownerMessage = `You approved the loan: ${loanData.material_details.title} by 
//                 ${loanData.borrower_details.first_name} ${loanData.borrower_details.last_name}.`;
//         const borrowerMessage = `Your request to borrow: ${loanData.material_details.title} was approved.`;
//         let message = {genericMessage, ownerMessage , borrowerMessage}
//         await handleLoanAction(loanId, action, dateField, message, priority, title);
//     };

//     const OnRejectClick = async () => {
//         const action = {};
//         const dateField = 'rejection_date';
//         const priority = {
//             owner_priority: isUserOwner ? "Low" : "Medium",
//             borrower_priority: isUserOwner ? "Low" : "Medium"
//         }
//         const title = "Loan Rejection";
//         const genericMessage = 'Loan rejected successfully!';
//         const ownerMessage = `You rejected the loan: ${loanData.material_details.title} by 
//                 ${loanData.borrower_details.first_name} ${loanData.borrower_details.last_name}.`;
//         const borrowerMessage = `Your request to borrow: ${loanData.material_details.title} was rejected.`;
//         let message = {genericMessage, ownerMessage , borrowerMessage}
//         await handleLoanAction(loanId, action, dateField, message, priority, title);
//     };

//     const OnCancelClick = async () => {
//         const action = {};
//         const dateField = 'cancellation_date';
//         const priority = {
//             owner_priority: isUserOwner ? "Medium" : "Low",
//             borrower_priority: isUserOwner ? "Low" : "Medium"
//         }
//         const title = "Loan Cancellation";
//         const genericMessage = 'Loan cancelled successfully!';
//         const ownerMessage = `Request Cancelled: ${loanData.material_details.title} by 
//                 ${loanData.borrower_details.first_name} ${loanData.borrower_details.last_name}.`;
//         const borrowerMessage = `You cancelled your request to borrow: ${loanData.material_details.title}.`;
//         let message = {genericMessage, ownerMessage , borrowerMessage}
//         await handleLoanAction(loanId, action, dateField, message, priority, title);
//     };

//     const OnReturnClick = async () => {
//         const action = { is_active: false };
//         const dateField = 'return_date';
//         const priority = {
//             owner_priority: isUserOwner ? "Medium" : "Low",
//             borrower_priority: isUserOwner ? "Low" : "Medium"
//         }
//         const title = "Material Return";
//         const genericMessage = 'Loan returned successfully!';
//         const ownerMessage = `Your material: ${loanData.material_details.title} was returned by 
//                 ${loanData.borrower_details.first_name} ${loanData.borrower_details.last_name}.`;
//         const borrowerMessage = `You returned the material: ${loanData.material_details.title}.`;
//         let message = {genericMessage, ownerMessage , borrowerMessage}
//         await handleLoanAction(loanId, action, dateField, message, priority, title);
//     };



//     useEffect(() => {
//         if (loanId) {

//             fetch(`${config.apiUrl}/loans/details/${loanId}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     setLoanData(data[0]);
//                 })
//                 .catch(error => console.error('Error fetching data:', error));
//         }
//     }, [loanId]);


//     return {
//         loanData,
//         user,
//         authorization,
//         isOwner,
//         isBorrower,
//         OnApproveClick,
//         OnRejectClick,
//         OnCancelClick,
//         OnReturnClick
//     };
// }