// import React, { useEffect, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import {
//     Divider, Card, Avatar, Tooltip, SvgIcon, OutlinedInput, InputAdornment,
//     CardActions, Button, Stack, Box, CardContent, Typography, Grid,
//     Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent
// } from '@mui/material';
// import { ChatBubbleLeftEllipsisIcon, PaperAirplaneIcon, TrashIcon, XMarkIcon, MinusIcon } from '@heroicons/react/24/outline';
// import { useAuth } from 'src/hooks/use-auth';
// import { toast } from 'react-toastify';
// import config from 'src/utils/config';
// import { formatDetailedDate } from 'src/utils/get-formatted-date';

// const countChildren = (comment) => {
//     let count = comment.children.length; // Count direct children
//     comment.children.forEach(child => {
//         count += countChildren(child); // Recursively count children of children
//     });
//     return count;
// };

// const statusMap = {
//     'Read': '#FFFFFF',
//     'Unread': '#FFFFFF'
// };

// export const CommentThread = ({ comment, parentId }) => {
//     const user = useAuth().user;
//     let date = formatDetailedDate(comment.created_at);
//     let children = countChildren(comment);
//     const [showThread, setShowThread] = useState(false);
//     const [showAnswerComment, setShowAnswerComment] = useState(false);
//     const [answer, setAnswer] = useState("");
//     const [canDelete, setCanDelete] = useState(false);
//     const [open, setOpen] = useState(false);

//     const handleDelete = useCallback(async () => {
//         try {
//             const response = await fetch(`${config.apiUrl}/comments/${comment.comment_id}/`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });

//             if (!response.ok) {
//                 toast.error('Could not delete comment, try again later', { autoClose: false });
//             } else {
//                 toast.success('The comment was successfully deleted', { autoClose: false });

//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 1000); 
//             }
//         } catch (error) {
//             toast.error('Could not delete comment, try again later', { autoClose: false });
//         }
//         setOpen(false);
//     }, [canDelete]);

//     const onCommentClick = useCallback(() => {
//         setShowAnswerComment((prevState) => !prevState);
//     });

//     const onViewThreadClick = useCallback(() => {
//         setShowThread((prevState) => !prevState);
//     }, [showThread]);

//     const onAnswerChange = (event) => {
//         setAnswer(event.target.value);
//     };

//     const onSendAnswer = useCallback(async () => {
//         let data = {
//             user: user.user_id,
//             content: answer,
//             parent_comment: comment.comment_id
//         };
//         try {
//             const response = await fetch(`${config.apiUrl}/comments/`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             if (!response.ok) {
//                 const errorMessage = await response.text();

//                 let decodeResponse = JSON.parse(errorMessage);
//                 let [firstKey] = Object.keys(decodeResponse);

//                 console.log(decodeResponse[firstKey]);
//                 toast.error("Error trying to send a new comment.", { autoClose: false });

//             } else {
//                 toast.success("Comment created successfully.");

//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000);
//             }

//         } catch (error) {
//             toast.error("Error trying to send a new comment. Try again later", { autoClose: false });
//         }
//     }, [answer]);

//     useEffect(() => {
//         console.log(comment);
//         if (user.user_id == comment.user) { setCanDelete(true); }
//     }, [user]);

//     return (
//         <Card
//             sx={{
//                 borderRadius: '0px',
//                 border: '1px solid #ffffff',
//                 minHeight: '100px'
//             }}
//             style={{ boxShadow: 'none' }}
//         >
//             <CardContent
//                 sx={{ pt: 1, pr: parentId ? 0 : 1, pl: 1 }}
//                 style={{ paddingBottom: 1 }}
//             >
//                 <Box
//                     sx={{
//                         p: { xs: 1, sm: 1.5, md: 2 }, // [CHANGED] Dynamic padding
//                         borderRadius: 1,
//                         alignItems: 'left',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         justifyContent: 'center',
//                         backgroundColor: () => (parentId ? '#f9f9f9' : '#f5f5f5')
//                     }}
//                 >
//                     <Grid container spacing={2} sx={{ alignItems: 'top' }}> {/* [CHANGED] Added spacing */}
//                         <Grid item xs={12} sm={2} md={1}> {/* [CHANGED] Responsive grid */}
//                             <Avatar
//                                 variant="rounded"
//                                 sx={{
//                                     height: { xs: 30, sm: 35, md: 40 }, // [CHANGED] Responsive sizes
//                                     width: { xs: 30, sm: 35, md: 40 },
//                                 }}
//                                 src=""
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={10} md={11}> {/* [CHANGED] Responsive grid */}
//                             <Stack
//                                 direction="row"
//                                 spacing={2}
//                                 sx={{
//                                     justifyContent: 'space-between',
//                                     alignItems: 'center'
//                                 }}
//                             >
//                                 <Typography
//                                     gutterBottom
//                                     variant="h6"
//                                     color="primary"
//                                     sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} // [CHANGED] Responsive font size
//                                 >
//                                     {comment.user_first_name} {comment.user_last_name}
//                                 </Typography>
//                                 <Typography
//                                     gutterBottom
//                                     variant="caption"
//                                 >
//                                     {date === 0 ? 'Today' : `${date}`}
//                                 </Typography>
//                             </Stack>

//                             <Typography
//                                 gutterBottom
//                                 variant="body2"
//                                 sx={{
//                                     whiteSpace: 'pre-line',
//                                     maxHeight: { xs: '200px', sm: '300px', md: '400px' }, // [CHANGED] Dynamic height
//                                     overflowY: 'auto'
//                                 }}
//                             >
//                                 {comment.content}
//                             </Typography>
//                             <Stack
//                                 direction="row"
//                                 spacing={1}
//                                 sx={{
//                                     py: 0,
//                                     justifyContent: 'flex-end'
//                                 }}
//                             >
//                                 {(comment.children.length !== 0) && <>
//                                     {!showThread && <Typography variant="caption">{children} comment(s)</Typography>}
//                                     <Tooltip title={showThread ? "See less" : "See Thread"}>
//                                         <SvgIcon fontSize='small' sx={{ cursor: 'pointer', fontSize: { xs: 18, sm: 24 } }} onClick={onViewThreadClick}> {/* [CHANGED] Responsive icon size */}
//                                             {showThread ? <MinusIcon /> : <ChatBubbleLeftEllipsisIcon />}
//                                         </SvgIcon>
//                                     </Tooltip> 
//                                 </>}
//                                 {!open && canDelete && 
//                                     <SvgIcon fontSize='small' sx={{ cursor: 'pointer' }} onClick={()=> setOpen(true)}>
//                                         <TrashIcon />
//                                     </SvgIcon> 
//                                 }
//                                 <Tooltip title={showAnswerComment ? "Cancel" : "Answer"}>
//                                     <SvgIcon fontSize='small' sx={{ cursor: 'pointer' }} onClick={onCommentClick}>
//                                         {showAnswerComment ? <XMarkIcon /> : <PaperAirplaneIcon />}
//                                     </SvgIcon>
//                                 </Tooltip>
//                             </Stack>
//                         </Grid>
//                         {showAnswerComment &&
//                             <>
//                                 <Divider />
//                                 <Grid
//                                     container
//                                     xs={12}
//                                 >
//                                     <OutlinedInput
//                                         value={answer}
//                                         onChange={onAnswerChange}
//                                         multiline
//                                         fullWidth
//                                         minRows={1}
//                                         maxRows={10}
//                                         placeholder="Your note ..."
//                                         sx={{ m: 1 }}
//                                         endAdornment={(
//                                             <InputAdornment position="end">
//                                                 <SvgIcon
//                                                     color="action"
//                                                     fontSize="small"
//                                                     sx={{
//                                                         cursor: 'pointer',
//                                                         fontSize: { xs: 18, sm: 24 } // [CHANGED] Responsive icon size
//                                                     }}
//                                                     onClick={onSendAnswer}
//                                                 >
//                                                     <PaperAirplaneIcon />
//                                                 </SvgIcon>
//                                             </InputAdornment>
//                                         )}
//                                     />
//                                 </Grid>
//                             </>
//                         }
//                     </Grid>
//                 </Box>
//                 {showThread && comment.children && comment.children.map((child, index) => (
//                     <CommentThread key={index} comment={child} parentId={comment.comment_id} />
//                 ))}
//             </CardContent>
//             {canDelete && 
//                 <Grid
//                     xs={12}
//                     md={6}
//                     lg={8}
//                 >
//                     <Dialog open={open} onClose={() => setOpen(false)} fullScreen={window.innerWidth < 600}> {/* [CHANGED] Fullscreen for mobile */}
//                         <DialogTitle>Delete Comment</DialogTitle>
//                         <DialogContent>
//                             <DialogContentText>
//                                 Are you sure you want to delete this comment?
//                             </DialogContentText>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={()=> setOpen(false)}>Cancel</Button>
//                             <Button onClick={handleDelete} color="error">Delete</Button>
//                         </DialogActions>
//                     </Dialog>
//                 </Grid>
//             }
//         </Card>
//     )
// };

// CommentThread.propTypes = {
//     comment: PropTypes.object.isRequired
// };



import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Divider, Card, Avatar, Tooltip, SvgIcon, OutlinedInput, InputAdornment,
    CardActions, Button, Stack, Box, CardContent, Typography, Grid,
    Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent
} from '@mui/material';
import { ChatBubbleLeftEllipsisIcon, PaperAirplaneIcon, TrashIcon, XMarkIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useAuth } from 'src/hooks/use-auth';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import { formatDetailedDate } from 'src/utils/get-formatted-date';

const countChildren = (comment) => {
    let count = comment.children.length;
    comment.children.forEach(child => {
        count += countChildren(child);
    });
    return count;
};

export const CommentThread = ({ comment, parentId }) => {
    const user = useAuth().user;
    let date = formatDetailedDate(comment.created_at);
    let children = countChildren(comment);
    const [showThread, setShowThread] = useState(false);
    const [showAnswerComment, setShowAnswerComment] = useState(false);
    const [answer, setAnswer] = useState("");
    const [canDelete, setCanDelete] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = useCallback(async () => {
        try {
            const response = await fetch(`${config.apiUrl}/comments/${comment.comment_id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                toast.error('Could not delete comment, try again later', { autoClose: false });
            } else {
                toast.success('The comment was successfully deleted', { autoClose: false });

                setTimeout(() => {
                    window.location.reload();
                }, 1000); 
            }
        } catch (error) {
            toast.error('Could not delete comment, try again later', { autoClose: false });
        }
        setOpen(false);
    }, [canDelete]);

    const onCommentClick = useCallback(() => {
        setShowAnswerComment((prevState) => !prevState);
    });

    const onViewThreadClick = useCallback(() => {
        setShowThread((prevState) => !prevState);
    }, [showThread]);

    const onAnswerChange = (event) => {
        setAnswer(event.target.value);
    };

    const onSendAnswer = useCallback(async () => {
        let data = {
            user: user.user_id,
            content: answer,
            parent_comment: comment.comment_id
        };
        try {
            const response = await fetch(`${config.apiUrl}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                let decodeResponse = JSON.parse(errorMessage);
                let [firstKey] = Object.keys(decodeResponse);
                console.log(decodeResponse[firstKey]);
                toast.error("Error trying to send a new comment.", { autoClose: false });

            } else {
                toast.success("Comment created successfully.");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }

        } catch (error) {
            toast.error("Error trying to send a new comment. Try again later", { autoClose: false });
        }
    }, [answer]);

    useEffect(() => {
        console.log(comment);
        if (user.user_id == comment.user) { setCanDelete(true); }
    }, [user]);

    return (
        <Card
            sx={{
                borderRadius: '0px',
                border: '1px solid #ffffff',
                minHeight: '100px'
            }}
            style={{ boxShadow: 'none' }}
        >
            <CardContent
                sx={{ pt: 1, pr: parentId ? 0 : 1, pl: 1 }}
                style={{ paddingBottom: 1 }}
            >
                <Box
                    sx={{
                        p: { xs: 1, sm: 1.5 }, // Reduced padding slightly
                        borderRadius: 1,
                        alignItems: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: () => (parentId ? '#f9f9f9' : '#f5f5f5')
                    }}
                >
                    <Grid container spacing={2} sx={{ alignItems: 'top' }}>
                        <Grid item xs={12} sm={2} md={1}>
                            {/* [CHANGED] Reduced Avatar Size */}
                            <Avatar
                                variant="rounded"
                                sx={{
                                    height: { xs: 30, sm: 35, md: 40 }, 
                                    width: { xs: 30, sm: 35, md: 40 },
                                }}
                                src=""
                            />
                        </Grid>
                        <Grid item xs={12} sm={10} md={11}>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    color="primary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    {comment.user_first_name} {comment.user_last_name}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="caption"
                                >
                                    {date === 0 ? 'Today' : `${date}`}
                                </Typography>
                            </Stack>

                            <Typography
                                gutterBottom
                                variant="body2"
                                sx={{
                                    whiteSpace: 'pre-line',
                                    maxHeight: { xs: '200px', sm: '300px', md: '400px' },
                                    overflowY: 'auto'
                                }}
                            >
                                {comment.content}
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    py: 0,
                                    justifyContent: 'flex-end'
                                }}
                            >
                                {(comment.children.length !== 0) && <>
                                    {!showThread && <Typography variant="caption">{children} comment(s)</Typography>}
                                    <Tooltip title={showThread ? "See less" : "See Thread"}>
                                        {/* [CHANGED] Reduced Icon Size */}
                                        <SvgIcon fontSize='small' sx={{ cursor: 'pointer', fontSize: { xs: 16, sm: 20 } }} onClick={onViewThreadClick}>
                                            {showThread ? <MinusIcon /> : <ChatBubbleLeftEllipsisIcon />}
                                        </SvgIcon>
                                    </Tooltip> 
                                </>}
                                {!open && canDelete && 
                                    <SvgIcon fontSize='small' sx={{ cursor: 'pointer', fontSize: { xs: 16, sm: 20 } }} onClick={()=> setOpen(true)}>
                                        <TrashIcon />
                                    </SvgIcon> 
                                }
                                <Tooltip title={showAnswerComment ? "Cancel" : "Answer"}>
                                    <SvgIcon fontSize='small' sx={{ cursor: 'pointer', fontSize: { xs: 16, sm: 20 } }} onClick={onCommentClick}>
                                        {showAnswerComment ? <XMarkIcon /> : <PaperAirplaneIcon />}
                                    </SvgIcon>
                                </Tooltip>
                            </Stack>
                        </Grid>
                        {showAnswerComment &&
                            <>
                                <Divider />
                                <Grid
                                    container
                                    xs={12}
                                >
                                    <OutlinedInput
                                        value={answer}
                                        onChange={onAnswerChange}
                                        multiline
                                        fullWidth
                                        minRows={1}
                                        maxRows={10}
                                        placeholder="Your note ..."
                                        sx={{ m: 1 }}
                                        endAdornment={(
                                            <InputAdornment position="end">
                                                <SvgIcon
                                                    color="action"
                                                    fontSize="small"
                                                    sx={{
                                                        cursor: 'pointer',
                                                        fontSize: { xs: 16, sm: 20 } // [CHANGED] Reduced Input Icon Size
                                                    }}
                                                    onClick={onSendAnswer}
                                                >
                                                    <PaperAirplaneIcon />
                                                </SvgIcon>
                                            </InputAdornment>
                                        )}
                                    />
                                </Grid>
                            </>
                        }
                    </Grid>
                </Box>
                {showThread && comment.children && comment.children.map((child, index) => (
                    <CommentThread key={index} comment={child} parentId={comment.comment_id} />
                ))}
            </CardContent>
            {canDelete && 
                <Grid
                    xs={12}
                    md={6}
                    lg={8}
                >
                    <Dialog open={open} onClose={() => setOpen(false)} fullScreen={window.innerWidth < 600}>
                        <DialogTitle>Delete Comment</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this comment?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=> setOpen(false)}>Cancel</Button>
                            <Button onClick={handleDelete} color="error">Delete</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            }
        </Card>
    )
};

CommentThread.propTypes = {
    comment: PropTypes.object.isRequired
};