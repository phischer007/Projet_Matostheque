import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import { format } from 'path';
import { useState, useCallback } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { toast } from 'react-toastify';
import config from 'src/utils/config';

export const CreateComment = () => {
    const user=  useAuth().user;
    const [content, setContent] = useState("");

    const onContentChange = (event) => {
        setContent(event.target.value);
    };

    const onSendClick = useCallback( async ()=>{
        try {
            let data = {
                user: user.user_id,
                content: content
            };

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
              // Get the first key
              let [firstKey] = Object.keys(decodeResponse);
              let error = `${firstKey} : ${decodeResponse[firstKey]}`
  
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
    }, [content]);

    return (
        <Card sx={{ p: 2, flexGrow: 1 }} >
            <OutlinedInput
                value={content}
                onChange={onContentChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Your comment ..."
                endAdornment={(
                    <InputAdornment position="end">
                        <SvgIcon
                            color="action"
                            fontSize="small"
                            sx={{
                                cursor: 'pointer'
                            }}
                            onClick={onSendClick}
                        >
                            <PaperAirplaneIcon />
                        </SvgIcon>
                    </InputAdornment>
                )}
            />
        </Card>
    )
};
