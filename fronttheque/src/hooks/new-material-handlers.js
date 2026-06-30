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
import { stringify } from 'node:querystring';


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
  const [codeError, setCodeError] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState( null);
  const [filesSelected, setFilesSelected] = useState(false);
  const [inputCNValue, setInputCNValue] = useState('');
  const [selectedCode, setSelectedCode] = useState(null);
  const [filteredCNOptions, setFilteredCNOptions] = useState([]);
  const [isMovable, setisMovable] = useState(false);
  const [is_formation_required, setis_formation_required] = useState(false);
  const [trust_circleList, setTrust_circle] = useState(null);
  const [condition, setCondition] = useState(null)
  const [serviceList, setServiceList] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    supplier: true,
    loan: true,
    // Change 'additional' from false to true to have it expanded by default
    additional: true,
    consumable: true,

    lab_supply: true
  });

  const [formData, setFormData] = useState({
    material_title: null,
    description: null,
    owner: null,
    trust_circle:null,
    origin: user.laboratory_address,
    loan_duration: 30,
    code_nacre: null,
    purchase_price: null,
    type: null,
    quantity_available: 1,
    expiration_date: null,
    manual_link: null,
    datasheet_link: null,
    sub_type:null,
    isMovable:false,
    is_formation_required:false,
    validation:true,
    service: user.service,
  });

  const [message, setMessage] = useState({
    status: null,
    value: ''
  });

  const [formErrors, setFormErrors] = useState({
        title: false,
        description: false,
        owner: false,
        trust_circle:false,
        location: false,
        type : false,
        sub_type:false,
        condition:false,
  });


  useEffect(() => {
    fetch(`${config.apiUrl}/trust_circle/`,{
      credentials: 'include'// Add this so the session cookie is sent!
    })
      .then(response => response.json())
      .then(data => {
        // Sort the data alphabetically by material_title
        if (data) {
            setTrust_circle(data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
    fetch(`${config.apiUrl}/services/`,{
      credentials: 'include'// Add this so the session cookie is sent!
    })
      .then(response => response.json())
      .then(data => {
        // Sort the data alphabetically by material_title
        if (data) {
            setServiceList(data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCheckChange = () => {
    setIsValidationChecked(!isValidationChecked);
  };
  const handleisMovableBoxChange = useCallback(() => {
    setisMovable((prevState) => !prevState);
  }, []);

  const handleis_formation_requiredBoxChange = useCallback(() => {
    setis_formation_required((prevState) => !prevState);
  }, []);

  const handleCondition = useCallback(() => {
    setCondition((prevState) => !prevState)
    setFormErrors(prev => ({
      ...prev,
      condition: false,
    }));
  })



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
  });
  

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


  const onSelectChange = useCallback(
    (event, values) => {
      setSelectedOwner(values);
    }, []
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
        trust_circle: formData.trust_circle === null,
        location: formData.origin === null || formData.material_title?.trim() === '',
        type : formData.type === null,
        sub_type: formData.sub_type === null,
        condition: condition !== true,
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
            { key: 'trust_circle', value: formData.trust_circle},
            { key: 'origin', value: formData.origin },
            { key: 'code_nacre', value: formData.code_nacre },
            { key: 'purchase_price', value: formData.purchase_price },
            { key: 'type', value: formData.type },
            { key: 'sub_type', value: formData.sub_type },
            { key: 'quantity_available', value: formData.quantity_available },
            { key: 'is_Movable', value: formData.isMovable },
            { key: 'is_formation_required', value: formData.is_formation_required },
            { key: 'validation', value: formData.validation },
            { key: 'service', value: formData.service },

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
            body: form, // Use the FormData object directly as the body
            credentials: 'include',
            headers: {
              'X-CSRFToken': csrftoken, // Add this
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

    }, [formData, router, codeError, selectedOwner, condition]);
  
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

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      isMovable: isMovable
    }));
  }, [isMovable]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      is_formation_required: is_formation_required
    }));
  }, [is_formation_required]);

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

  useEffect(() => {
  if (ownersArray?.length) {
    const owner = ownersArray.find(
      owner => Number(owner.user_id) === Number(user.user_id)
    );
    setSelectedOwner(owner || null);
  }
}, [ownersArray]);
  

  return {
    isValidationChecked,
    formData,
    message,
    selectedOwner,
    handleCheckChange,
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
    handleis_formation_requiredBoxChange,
    is_formation_required,
    handleisMovableBoxChange,
    isMovable,
    handleDateChange,
    trust_circleList,
    condition,
    handleCondition,
    serviceList
  };
};
