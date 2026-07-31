import { useRouter } from 'next/navigation';
import { 
  useCallback, 
  useState, 
  useEffect
} from 'react';
import config from 'src/utils/config';
import moment from 'moment';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import codes from 'src/data/code_nacre/code_nacre.json'
import { getCookie } from 'src/utils/csrf';
import { useAuth } from './use-auth';


const compressAndUploadImages = async (images) => {
  const compressedImages = [];

  for (const [_, file] of images) {
    try {
      const compressedImage = await imageCompression(file, {
        maxSizeMB: 0.5, // Set the maximum file size in megabytes
        maxWidthOrHeight: 1920, // Set the maximum width or height of the image 1920x1920
        useWebWorker: true, // Use web worker for faster compression (optional)
      });

      compressedImages.push(compressedImage);
    } catch (error) {
      console.error('Image compression failed:', error);
    }
  }

  return compressedImages;
};

const indefiniteDuration = 365;

export const useNewMaterialHandlers = (data) => {
  let ownersArray = data;
  const user = useAuth().user
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isValidationChecked, setIsValidationChecked] = useState(true);
  const [isShared, setIsShared] = useState(false);
  const [superOwner, setSuperOwner] = useState(null);
  const [codeError, setCodeError] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isDurationEnabled, setIsDurationEnabled] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  const [inputCNValue, setInputCNValue] = useState('');
  const [selectedCode, setSelectedCode] = useState(null);
  const [filteredCNOptions, setFilteredCNOptions] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    supplier: true,
    loan: true,
    additional: true,
    consumable: true,
    lab_supply: true
  });

  const [formData, setFormData] = useState({
    material_title: null,
    description: null,
    team: "",
    owner: null,
    origin: null,
    loan_duration: 30,
    code_nacre: null,
    purchase_price: null,
    type: null,
    quantity_available: 1,
    expiration_date: null,
    manual_link: null,
    datasheet_link: null,
    sub_type:null,
    validation:true,
  });

  const [message, setMessage] = useState({
    status: null,
    value: ''
  });

  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    owner: false,
    location: false,
    type : false,
    sub_type:false,
  });

  const handleCheckChange = () => {
    setIsValidationChecked(!isValidationChecked);
  };

  const handleSharedChange = useCallback(() => {
    setIsShared(!isShared);
  }, [isShared]);

  const handleChange = useCallback(
    (event) => {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

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

  const handleChangeNum = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value.replace(/\D/g, "") // garde seulement les chiffres
    }));
  }, []);

  // Handle file upload
  const handleFileChange = useCallback(
    (e) => {
      if (e.target.files.length > 0) {
        setImages([...e.target.files]);
        setFilesSelected(true);
      } else {
        setFilesSelected(false);
      }
  }, []);
  

  const handleCodeNacreValidation = useCallback(
    (value) => {
      if (formData.code_nacre && formData.code_nacre != "") {
        const regex = /^[A-Z]{2}\.[0-9]{2}$/; //code nacre regex
        let code = formData.code_nacre;
        if (!regex.test(code)) {
          setCodeError(true);
          toast.error("Please use a valid Code NACRE format. You can use the provided link to check if needed.", { autoClose: false });
        } else {
          setCodeError(false);
          toast.dismiss();
        }
      } else {
        setCodeError(false);
        toast.dismiss();
      }
    }, [formData]);

  const handleToggleChange = useCallback(
    () => {
      setIsDurationEnabled(!isDurationEnabled);
    },
    [isDurationEnabled]
  );

  const onSelectChange = useCallback(
    (event, values) => {
      setSelectedOwner(values);
      const isOwnerShared = values && superOwner && superOwner.user_id !== undefined 
        ? values.user_id === superOwner.user_id 
        : false;
      setIsShared(isOwnerShared);
    }, [superOwner]
  );

  const handleAccordionChange = useCallback((section) => {
    setExpandedSections((prevExpandedSections) => ({
      ...prevExpandedSections,
      [section]: !prevExpandedSections[section],
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsUploading(true);
      if (codeError) {
        toast.error("Please use a valid Code NACRE format.", { autoClose: false });
        return
      }

      const images = Array.from(formData.images);
      const compressedImages = images ? await compressAndUploadImages(images) : null;
      const newErrors = {
        title: formData.material_title === null || formData.material_title?.trim() === '',
        description: formData.description === null || formData.material_title?.trim() === '',
        owner: selectedOwner === null,
        location: formData.origin === null || formData.material_title?.trim() === '',
        type : formData.type === null,
        sub_type: formData.sub_type === null,
        loan_duration: isDurationEnabled && formData.loan_duration === null,
      };
      //TODO: Add error for consummables
      setFormErrors(newErrors);
      console.log(newErrors)
      if (!Object.values(newErrors).some(error => error)) {
        // try {
          //creating a new FormData to allow sending pictures
          const form = new FormData();
          const fieldsToAppend = [
            { key: 'material_title', value: formData.material_title },
            { key: 'description', value: formData.description },
            { key: 'manual_link', value: formData.manual_link },
            { key: 'datasheet_link', value: formData.datasheet_link },
            { key: 'user', value: selectedOwner.user_id },
            { key: 'origin', value: formData.origin },
            { key: 'code_nacre', value: formData.code_nacre },
            { key: 'purchase_price', value: formData.purchase_price },
            { key: 'type', value: formData.type },
            { key: 'sub_type', value: formData.sub_type },
            { key: 'quantity_available', value: formData.quantity_available },
            { key: 'validation', value: formData.validation },
            { key: 'loan_duration', value: isDurationEnabled ? formData.loan_duration : indefiniteDuration },
          ];
          // New append field for Lab Supply category conditions
          if (formData.type === "LAB_SUPPLIES") {
            fieldsToAppend.push(
            { key: 'loan_duration', value: formData.loan_duration },
            );
          }
          else if (formData.type === "CONSUMABLES") {
            fieldsToAppend.push(
            { key: 'expiration_date', value: formData.expiration_date },
            );
          }

          // Append image files
          if (compressedImages) {
            compressedImages.forEach((image, index) => {
              form.append(`image_${index}`, image);
            });
          }

          // Append all fields to the form
          fieldsToAppend.forEach(({ key, value }) => {
            if (value !== undefined && value !== null && value !== "") {
              form.append(key, value);
            }
          });

          const csrftoken = getCookie('csrftoken');
          const response = await fetch(`${config.apiUrl}/materials/create/`, {
            method: 'POST',
            body: form, 
            credentials: 'include',
            headers: {
              'X-CSRFToken': csrftoken, 
            },
          });


          if (!response.ok) {
            if (response.status === 413) {
              setMessage({
                status: 'error',
                value: "Please consider compressing your images or try ulteriorly."
              });
            } else {
              const errorMessage = await response.text();
              let decodeResponse = JSON.parse(errorMessage);
              // Get the first key
              let [firstKey] = Object.keys(decodeResponse);
              setMessage({
                status: 'error',
                value: `${firstKey} : ${decodeResponse[firstKey]}`
              });
            }
          } else {
            const data = await response.json();
            setMessage({
              status: 'success',
              value: 'Material created successfully! You will be redirected soon.'
            });

            setTimeout(() => {
              router.push(`/details/material-detail/${data.material_id}`);
            }, 2000);
          }
          setIsUploading(false);
      }

      setIsUploading(false);

    }, [formData, router, codeError, isDurationEnabled, selectedOwner]);
  
    const filterOptions = useCallback((value) => {
      const inputWords = value.toLowerCase().split(' ');
      const matchingLabels = new Set();
      
      inputWords.forEach((word) => {
        for (const key in wordIndex) {
          if (key.includes(word)) {
              wordIndex[key].forEach((code) => {
                  matchingLabels.add(code);
              });
          }
        }
      });

      const filteredOptions = Array.from(matchingLabels);
      setFilteredCNOptions(filteredOptions);
    }, [wordIndex]);
    
  const handleDateChange = (newValue) => {
    let newdate =moment(newValue).format("YYYY-MM-DD")
    if (newdate !== "Invalid date"){
      setFormData({
      ...formData,
      expiration_date: newdate ,
    });
    }else {
      setFormData({
      ...formData,
      expiration_date: null ,
    });
    }

  };

  const handleInputCNChange = useCallback((e, newValue) => {
    setFilteredCNOptions([]);
    setInputCNValue(newValue);

    if(newValue === ""){
      setSelectedCode(null);
      setFormData((prevState) => ({
        ...prevState,
        code_nacre: null
      }));
    }else{
      filterOptions(newValue);
    }
  },[filterOptions]);

  const handleCodeNChange = (value) => {
    let code_object = codes.find(code => code.Label === value);
    setSelectedCode(code_object);
    if (code_object) {
      setFormData((prevState) => ({
        ...prevState,
        code_nacre: code_object.Code
      }));
    }
  };


  useEffect(() => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      images: formData
    }));
  }, [images]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      validation: isValidationChecked
    }));
  }, [isValidationChecked]);

  /*Creating an index of the keywords, speed the search process*/
  useEffect(() => {
    let indexes = {};
    codes.forEach((code) => {
      const words = code.Label.toLowerCase().split(' ');
      words.forEach((word) => {
        if (!indexes[word]) {
          indexes[word] = [];
        }
        if (!indexes[word].includes(code)) {
          indexes[word].push(code);
        }
      });
    });
    setWordIndex(indexes);
  }, []);

  // Identify the superOwner ("liphy")
  useEffect(() => {
    if (ownersArray) {
      let owner = ownersArray.find(owner => {
        // Adjust owner_name property if it differs in your objects
        if (owner.is_staff && owner.owner_name?.toLowerCase().includes("liphy")) {
          return true;
        }
      });
      setSuperOwner(owner);
    }
  }, [ownersArray]);

  // Handle auto-selection on load/update with isShared logic
  useEffect(() => {
    if (ownersArray?.length) {
      const defaultOwner = ownersArray.find(
        owner => Number(owner.user_id) === Number(user.user_id)
      );
      if (defaultOwner) {
        setSelectedOwner(defaultOwner);
        const isOwnerShared = superOwner && superOwner.user_id !== undefined 
          ? defaultOwner.user_id === superOwner.user_id 
          : false;
        setIsShared(isOwnerShared);
      } else {
        setSelectedOwner(null);
      }
    }
  }, [ownersArray, user, superOwner]);

  // Sync state when isShared toggles
  useEffect(() => {
    if (isShared) {
      setSelectedOwner(superOwner);
      setIsValidationChecked(false);
    } else {
      setIsValidationChecked(true);
    }
  }, [isShared, superOwner]);
  

  return {
    isValidationChecked,
    isShared,
    formData,
    message,
    selectedOwner,
    handleCheckChange,
    handleSharedChange,
    handleChange,
    handleChangeNum,
    handleChangeNumDec,
    handleSubmit,
    handleFileChange,
    filesSelected,
    onSelectChange,
    isUploading,
    formErrors,
    expandedSections,
    handleAccordionChange,
    filteredCNOptions,
    selectedCode,
    inputCNValue,
    handleInputCNChange,
    handleCodeNChange,
    handleDateChange,
    handleCodeNacreValidation,
    handleToggleChange,
    isDurationEnabled
  };
};