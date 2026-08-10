// i18n.js

import i18n from 'i18next';
import { title } from 'node:process';
import { initReactI18next } from 'react-i18next';

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('appLanguage') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          navbar: { 
            overview: "Overview", 
            catalog: "Catalog", 
            loans: "Loans", 
            profile: "Profile",
            notifications: "Notifications",
            personalMaterials: "Personal Materials", 
            threads: "Threads",                     
            userManagement: "User Management"       
          },
          hero: {
            title: "Welcome to Matostheque",
            subtitle: "A shared library to borrow, lend lab materials among researchers, lab technicians and laboratories."
          },
          dashboard: {
            title: "Dashboard",
            error_generic: "An error occurred. Please try again later.",
            success_update: "Your account was successfully updated!",
            error_unexpected: "An unexpected error occurred. Please try again later.",
            totalMaterials: "Total Materials",
            addedThisMonth: "added this month",
            addedThisYear: "added this year",
            totalLoansApproved: "Total Loans Approved",
            approvedThisMonth: "approved this month",
            approvedThisYear: "approved this year",
            recentActivity: "Recent Activity",
            materialsInventory: "Materials Inventory by Team",
            items: "items",
            welcomeTitle: "Welcome to Matostheque!",
            welcomeMessage: "We are happy you joined the community. Please choose the type of account you want.",
            userRole: "User",
            userDesc: "A simple user can view the inventory and borrow equipments.",
            ownerRole: "Owner",
            ownerDesc: "An owner provides equipments he/she is willing to lend and can also borrow other equipments.",
            confirmBtn: "Confirm",
            latestMaterialsAdded: "Latest Materials Added",
            updatedMaterialsDays: "Updated {{ago}} ago",
            viewall: "View All",
          },
          months: {
            january: "January",
            february: "February",
            march: "March",
            april: "April",
            may: "May",
            june: "June",
            july: "July",
            august: "August",
            september: "September",
            october: "October",
            november: "November",
            december: "December",
          },
          latestLoans: {
            title: "Loans",
            generalInfo: "General loans information",
            yourinfo: "Your loan information",
            material: "Material",
            type: "Type",
            ownerName: "Owner's Name",
            duration: "Duration",
            date: "Date",
            quantity: "Quantity",
            status: "Status",
            viewall: "View All"
          },
          newComment: {
            title: "@Threads",
            yourComment: "Your comment ...",
          },
          newAccount: {
            title: "Account",
            profile: "Profile",
            profileSubtitle: "The information can be edited",
            errorNoPicture: "No picture selected!",
            successUpload: "Pictures uploaded successfully!",
            errorUpload: "An error occurred while uploading pictures.",
            notFoundUser: "User not found. Please try again.",
            notFoundSession: "Session token not found. Please try again.",
            errorSession: "Your session has expired. Please log in again.",
            errorUserOwnership: "You can't become a user because you still own materials",
            successInfoUpdate: "Your information was successfully updated!",
            errorInfoUpdate: "An error occurred while updating your information. Please try again later.",
            btnUpload: "Upload",
            btnSave: "Save details",
            txtFilesSelected: "Files Selected",
            txtFilesPictures: "Choose Picture",
            roleAccount: "{{role}} Account",
            firstName: "First Name",
            lastName: "Last Name",
            emailaddress: "Email Address",
            roleOwnership: "Activate your account to gain access to adding materials",
          },
          persMaterials: {
            title: "Personal Materials",
            btnAdd: "Add",
          },
          perloansSearch: {
            placeholder: "Material Name or Borrower Name or Owner Name",
          },  
          persLoansTable: {
            persLoanRequest: "Personal Loan Requests",
            persLoanRequestSubtitle: "Track your active loans and requests ",
            persLendingManagement: "Lending Management",
            persLendingManagementSubtitle: "Manage active loans and review incoming requests",
            filterByType: "Filter by Type:",
            filterByStatus: "Filter by Status:",
            headers: {
              title: "Title",
              type: "Type",
              ownerName: "Owner's Name",
              borrower: "Borrower",
              duration: "Duration",
              loanDate: "Loan Date",
              quantity: "Quantity",
              status: "Status"
            },
            rowsPerPage: "Rows per page:",
          },
          staticData: {
            loanTypes: {
              None: "None",
              Loan: "Loan",
              Donation: "Donation"
            },
            loanStatus: {
              None: "None",
              "Pending Validation": "Pending Validation",
              Overdue: "Overdue",
              Borrowed: "Borrowed",
              Closed: "Closed",
              Canceled: "Canceled",
              Rejected: "Rejected",
              Booked: "Booked"
            },
            notificationTypes: {
              "Request Alert": "Request Alert",
              "Event": "Event",
              "General": "General"
            },
            userStatus: {
              "True": "Actif",
              "False": "Inactif",
              "Null": "Tous"
            },
            materialTypes: {
              LAB_SUPPLIES: "Lab Supplies",
              CONSUMABLES: "Consumables"
            },
            unitList: {
              M: "Meter",
              KG: "Kilogram",
              G: "Gram",
              L: "Liter",
              ML: "Milliliter",
              PC: "Piece"
            }
          },
          persManageMaterials: {
            title: "Manage Personal Material Availability",
            headers: {
              title: "Title",
              description: "Description",
              quantity: "Quantity",
              status: "Status"
            },
            availabilityActions: {
              title_available: "Put on Loan / Donation",
              title_unavailable: "Remove from Loan / Donation",
              available_content: "Are you sure you want to make the selected materials available for borrowing again?",
              remove_content: "Are you sure you want to make the selected materials unavailable for borrowing?",
              btnAvailableText: "Make Available",
              btnRemoveText: "Remove Availability",
              textStatusAvailable: "Available",
              textStatusUnavailable: "Unavailable",
              btnCancelText: "Cancel",
              error_message_not_updated: "Some materials could not be updated.",
              error_message_try_again: "Could not update materials, try again later",
              succes_message: "Materials successfully updated.",
            }
          },
          inventoryMaterials: {
            title: "Catalog - Materials",
            btnAdd: "Add",
            materialSearchField: {
              placeholder: "Material name or Material number or Owner or Description",
              informationText: "You can search a material by the material's name, the owner's name, description, the material number on the qrcode (ex. Matostheque-001, type 001)"
            },
            materialFilterCategory: {
              title: "Filter by Category",
              resetBtn: "Reset Filters",
              staticData: {
                sectionConsumables: "Consumables",
                sectionLabSupplies: "Lab Supplies",
                filterConsumableTypes: {
                  FILTERS_FILTRATION_SUPPLIES: "Filters and Filtration Supplies",
                  BIOLOGICAL_CONSUMABLES: "Biological Consumables",
                  CHEMICALS: "Chemicals",
                  SAFETY_EQUIPMENT: "Safety Equipment",
                  LAB_FURNITURE_FIXTURES: "Lab Fixtures",
                  CLEANING_MAINTENANCE_SUPPLIES: "Cleaning and Maintenance Supplies"
                },
                filterLabSupplyTypes: {
                  COMPUTING: "Computing",
                  ELECTRONICS: "Electronics",
                  MECHANICAL: "Mechanical",
                  OPTICS_LASER: "Optics or Laser",
                  GAS_FLUIDS: "Gas or Fluids",
                  BIOLOGICAL: "Biological",
                  CHEMISTRY: "Chemistry",
                  BOOKS: "Books",
                  OFFICE_BUILDING: "Office and Building",
                  Others: "Others"
                }
              }
            },
            materialListCard: {
              quantity: "Quantity {{qty}}",
              durationDays: "{{duration}} Days"
            }
          },
          reqLoanDetails: {
            title: "Loan Details",
            btnReturn: "Return",
            btnApprove: "Approve",
            btnReject: "Reject",
            btnCancel: "Cancel",
            unauthorizedText: "You don't have the authorization to access this page.",
            loadingData: "...Loading data",
            btnSaveChanges: "Save changes",
            btnDeleteRecord: "Delete loan record",
            noMaterialFound: "No material found!!",
            fields: {
              materialTitle: "Material Title",
              materialType: "Material Type",
              status: "Status",
              borrower: "Borrower",
              borrowerEmail: "Borrower's Email",
              startingDate: "Starting date",
              duration: "Duration (in day)",
              quantity: "Quantity",
              location: "Location",
              contactPerson: "Contact person",
              contactPersonEmail: "Contact person's Email",
              borrowerNote: "Borrower's Note"
            },
          },
          reqNofitications: {
            title: "Notifications",
            subtitle: "No notification to show yet",
            popupView: "View all",
            popupNone: "No notification to show.",
            today: "Today",
            loanOfMaterial: "- Loan of the material:"
          },
          newLoan: {
            messages: {
              infoLabSupplies: "You can borrow the material up to {{duration}} days. \n You can borrow up to {{quantity}}",
              infoConsumables: "You can borrow up to {{quantity}}",
              infoDuration: "You can borrow the material up to {{duration}} days.",
              errorSubmit: "Could not borrow. Please verify your data or try again later."
            },
            notifications: {
              ownerPending: "You have a new pending request: {{title}}",
              ownerBooked: "{{name}} has booked your material: {{title}}.",
              borrowerSuccess: "You successfully booked the material: {{title}}."
            }
          },
          timeDifference: {
            secondsAgo: "{{count}} seconds ago",
            minutesAgo: "{{count}} minutes ago",
            hoursAgo: "{{count}} hours ago",
            daysAgo: "{{count}} days ago"
          },
          userManagement: {
            title: "List of Users",
            placeholder: "Search by First Name, Last Name",
            table: {
              filterStatus: "Filter by status:",
              headers: {
                name: "Name",
                email: "Email",
                role: "Role",
                lastConnection: "Date of last connection",
                status: "Status"
              },
              statusActive: "Active",
              statusNotActive: "Not Active",
              rowsPerPage: "Rows per page:",
              of: "of",
              moreThan: "more than"
            },
            dialog: {
              title: "Deactivate User & Transfer Materials?",
              content1: "Are you sure you want to deactivate ",
              content2: "?",
              content3: "Because if this user is deactivated, all materials currently owned by them will be automatically transferred to your Admin account to prevent them from being lost.",
              btnCancel: "Cancel",
              btnDeactivate: "Deactivate & Transfer"
            },
            toasts: {
              transferSuccess: "{{firstName}}'s materials were successfully transferred.",
              activeSuccess: "{{firstName}} is now active.",
              updateError: "Could not update user status. Please try again."
            }
          },
          newMaterial: {
            title: "New Material",
            heading: "Add a new material",
            form: {
              subheader: "Fill the material information",
              generalInfo: "General Information",
              title: "Title",
              materialType: "Material Type",
              description: "Description",
              descriptionPlaceholder: "Describe the material here to help others ...",
              quantity: "Quantity",
              dynamicInfo: "{{type}} Information",
              labSupplyType: "Lab Supply Type",
              consumableType: "Consumable Type",
              selectType: "Select a type",
              allowedLoanDuration: "Allowed Loan Duration",
              typeNumberInDays: "(Type a number in days.*)",
              typeNumberInDaysLabel: "Type a number in days.",
              expirationDate: "Expiration Date",
              unit: "Unit",
              supplierInfo: "Supplier Information",
              ownerPlaceholder: "Owner (activate account to see your name)",
              sharedMaterial: "Shared material",
              selectTeam: "Select your team",
              loanInfo: "Loan Information",
              location: "Location",
              locationPlaceholder: "Ex. Room 203",
              askValidation: "Ask for validation",
              enableLoanDuration: "Enable Loan Duration",
              additionalInfo: "Additional Information",
              userManualLink: "User Manual Link",
              datasheetLink: "Manufacturer Datasheet Link",
              codeNacre: "Code Nacre",
              purchasePrice: "Purchase Price (Approximatively)",
              inEuros: "In Euros.",
              picturesSelected: "Pictures Selected",
              uploadPictures: "Upload Pictures",
              maxPhotosNote: "Note that you can only upload a maximum of two photos at a time!",
              btnCreate: "Create",
              uploading: "Uploading"
            },
            messages: {
              invalidCodeNacre: "Please use a valid Code NACRE format. You can use the provided link to check if needed.",
              invalidCodeNacreShort: "Please use a valid Code NACRE format.",
              compressImages: "Please consider compressing your images or try ulteriorly.",
              successCreate: "Material created successfully! You will be redirected soon."
            }
          },
          materialDetailCalendar: {
            hiddenUser: "Hidden User",
            labels: {
              name: "Name:",
              contact: "Contact:",
              location: "Location:",
              quantity: "Quantity:"
            },
            toolbar: {
              today: "Today",
              previous: "Back",
              next: "Next",
              month: "Month",
              week: "Week",
              day: "Day",
              agenda: "Agenda",
              showMore: "more"
            }
          },
          materialDetailEdit: {
            cardTitle: "Details",
            cardSubheader: "The information can be edited",
            loading: "...Loading",
            fields: {
              title: "Title",
              contactPerson: "Contact person",
              ownerLabel: "Contact person (activate account to see your name)",
              type: "Type",
              subType: "Sub Type",
              expirationDate: "Expiration Date",
              duration: "Duration",
              availableQuantity: "Available Quantity",
              description: "Description",
              location: "Location / address",
              manualLink: "User Manual Link",
              datasheetLink: "Manufacturer Datasheet Link"
            },
            helpers: {
              typeDisabled: "This field can't be edited.",
              days: "days",
              validationNeededCheck: "If checked, a validation from the contact person will be needed.",
              validationNeededText: "A validation from the contact person is needed."
            },
            buttons: {
              saveDetails: "Save details"
            },
            messages: {
              successUpdate: "Material details updated successfully!",
              errorSubmit: "Error trying to submit: {{error}}"
            }
          },
          materialDetailViewer: {
            confirmDelete: "Are you sure you want to delete this picture?",
            noPicturesAdded: "No pictures added yet.",
            deleteTooltip: "Delete Picture",
            filesSelected: "Files Selected",
            choosePictures: "Choose Pictures",
            upload: "Upload",
            errors: {
              deleteFailed: "Failed to delete image.",
              deleteException: "Error trying to delete picture: {{error}}",
              noPictures: "No pictures to upload!",
              uploadException: "Error trying to upload pictures: {{error}}"
            },
            success: {
              delete: "Picture deleted successfully!",
              upload: "Pictures uploaded successfully!"
            }
          },
          materialDetailOverview: {
            toasts: {
              invalidUrl: "The provided url is not a valid one.",
              noManual: "No manual link provided.",
              noDatasheet: "No datasheet link provided."
            },
            tooltips: {
              manual: "Manual",
              datasheet: "Datasheet"
            },
            labels: {
              contact: "Contact :",
              email: "E-mail :",
              materialNumber: "Material Number :",
              available: "Available",
              notAvailable: "Not Available"
            },
            buttons: {
              loadingDocument: "Loading Document",
              printPdf: "Print QRCode as PDF",
              printDirect: "Print QRCode & Material Number"
            }
          },
          materialDetailsPage: {
            pageTitle: "Material Details",
            buttons: {
              bookMaterial: "Book Material",
              notAvailableForLoan: "Not Available For loan",
              deleteMaterial: "Delete Material",
              cancel: "Cancel"
            },
            toasts: {
              deleteError: "Could not delete material, try again later",
              deleteSuccess: "The material was successfully deleted",
              updateStatusError: "Could not update the material status.",
              success_removed_loan: "The material was successfully removed from loan",
              success_added_loan: "The material was successfully put on loan",
              success_removed_donation: "The material was successfully removed from donation",
              success_added_donation: "The material was successfully put on donation",
              updateError: "Could not update the material, try again later"
            },
            dialog: {
              deleteTitle: "Delete Material",
              deleteContent: "Are you sure you want to delete this material?",
              deleteBtn: "Delete",
              removeLoanTitle: "Remove from Loan",
              putLoanTitle: "Put on Loan",
              removeLoanContent: "Are you sure you want to remove this material from Loan?",
              putLoanContent: "Are you sure you want to make this material available for Loan?",
              removeLoanBtn: "Remove From Loan",
              putLoanBtn: "Put On Loan",
              removeDonationTitle: "Remove from Donation",
              putDonationTitle: "Put on Donation",
              removeDonationContent: "Are you sure you want to remove this material from Donation?",
              putDonationContent: "Are you sure you want to make this material available for Donation?",
              removeDonationBtn: "Remove From Donation",
              putDonationBtn: "Put On Donation"
            }
          },
          createLoan: {
            pageTitle: "Loan",
            title: "Borrow a material",
            card: {
              title: "Loan Information",
              subheader: "Fill the information to submit your loan",
              fields: {
                materials: "Materials *",
                materialsPlaceholder: "Select a material",
                startDate: "Start Date *",
                endDate: "End Date *",
                quantity: "Quantity",
                quantityPlaceholder: "Ex. 1",
                location: "Location",
                locationPlaceholder: "Ex. Room 203",
                note: "Note to the contact person",
                notePlaceholder: "Write your message to the contact person here..."
              },
              errors: {
                material: "Please select a material",
                startDate: "The start date is mandatory",
                endDate: "The end date is mandatory",
                location: "Please select a location"
              },
              buttons: {
                borrow: "Borrow"
              }
            }
          },
          overviewNotification: {
            title: "Notification",
            date: "Date:"
          }

        },
      },

      fr: {
        translation: {
          navbar: { 
            overview: "Accueil", 
            catalog: "Catalogue", 
            loans: "Emprunts", 
            profile: "Profil",
            notifications: "Notifications",
            personalMaterials: "Matériel Personnel",   
            threads: "Discussions",                    
            userManagement: "Gestion des utilisateurs"
          },
          hero: {
            title: "Bienvenue à la Matosthèque",
            subtitle: "Une bibliothèque partagée pour emprunter et prêter du matériel de laboratoire entre chercheurs, techniciens de laboratoire et laboratoires."
          },
          dashboard: {
            title: "Tableau de bord",
            error_generic: "Une erreur est survenue. Veuillez réessayer plus tard.",
            success_update: "Votre compte a été mis à jour avec succès !",
            error_unexpected: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
            totalMaterials: "Total du matériel",
            addedThisMonth: "ajouté ce mois-ci",
            addedThisYear: "ajouté cette année",
            totalLoansApproved: "Total des emprunts approuvés",
            approvedThisMonth: "approuvé ce mois-ci",
            approvedThisYear: "approuvé cette année",
            recentActivity: "Activité récente",
            materialsInventory: "Inventaire du matériel par équipe",
            items: "articles",
            welcomeTitle: "Bienvenue à la Matosthèque !",
            welcomeMessage: "Nous sommes heureux que vous ayez rejoint la communauté. Veuillez choisir le type de compte que vous souhaitez.",
            userRole: "Utilisateur",
            userDesc: "Un simple utilisateur peut consulter l'inventaire et emprunter du matériel.",
            ownerRole: "Propriétaire",
            ownerDesc: "Un propriétaire fournit du matériel qu'il est prêt à prêter et peut également emprunter d'autres équipements.",
            confirmBtn: "Confirmer",
            latestMaterialsAdded: "Derniers matériels ajoutés",
            viewall: "Voir tout",
            updatedMaterialsDays: "Mis à jour il y a {{ago}}",
          },
          months: {
            january: "Janvier",
            february: "Février",
            march: "Mars",
            april: "Avril",
            may: "Mai",
            june: "Juin",
            july: "Juillet",
            august: "Août",
            september: "Septembre",
            october: "Octobre",
            november: "Novembre",
            december: "Décembre",
          },
          latestLoans: {
            title: "Emprunts",
            generalInfo: "Informations générales sur les emprunts",
            yourInfo: "Vos informations d'emprunt",
            material: "Matériel",
            type: "Type",
            ownerName: "Nom du propriétaire",
            duration: "Durée",
            date: "Date",
            quantity: "Quantité",
            status: "Statut",
            viewall: "Voir tout"
          },
          newComment: {
            title: "@Discussions",
            yourComment: "Votre commentaire ...",
          },
          newAccount: {
            title: "Compte",
            profile: "Profil",
            profileSubtitle: "L'information peut être modifiée",
            errorNoPicture: "Aucune image sélectionnée !",
            successUpload: "Les images ont été téléchargées avec succès !",
            errorUpload: "Une erreur est survenue lors du téléchargement des images.",
            notFoundUser: "Utilisateur non trouvé. Veuillez réessayer.",
            notFoundSession: "Token de session non trouvé. Veuillez réessayer.",
            errorSession: "Votre session a expiré. Veuillez vous reconnecter.",
            errorUserOwnership: "Vous ne pouvez pas devenir un utilisateur car vous possédez encore du matériel.",
            btnUpload: "Télécharger",
            btnSave: "Enregistrer les détails",
            txtFilesSelected: "Fichiers sélectionnés",
            txtFilesPictures: "Choisir une image",
            roleAccount: "Compte {{role}}",
            firstName: "Prénom",
            lastName: "Nom de famille",
            emailaddress: "Adresse email",
            roleOwnership: "Activez votre compte pour accéder à l'ajout de matériel",
          },
          persMaterials: {
            title: "Matériel Personnel",
            btnAdd: "Ajouter",
          },
          perloansSearch: {
            placeholder: "Nom du matériel ou Nom de l'emprunteur ou Nom du propriétaire",
          },
          persLoansTable: {
            persLoanRequest: "Demandes de prêt personnelles",
            persLoanRequestSubtitle: "Suivez vos prêts et demandes actifs",
            persLendingManagement: "Gestion du prêt",
            persLendingManagementSubtitle: "Gérez les prêts actifs et examinez les demandes entrantes",
            filterByType: "Filtrer par type:",
            filterByStatus: "Filtrer par statut:",
            headers: {
              title: "Titre",
              type: "Type",
              ownerName: "Nom du propriétaire",
              borrower: "Emprunteur",
              duration: "Durée",
              loanDate: "Date d'emprunt",
              quantity: "Quantité",
              status: "Statut"
            },
            rowsPerPage: "Lignes par page:",
          },
          staticData: {
            loanTypes: {
              None: "Aucun",
              Loan: "Emprunt",
              Donation: "Don"
            },
            loanStatus: {
              None: "Aucun",
              "Pending Validation": "En attente de validation",
              Overdue: "En retard",
              Borrowed: "Emprunté",
              Closed: "Clôturé",
              Canceled: "Annulé",
              Rejected: "Rejeté",
              Booked: "Réservé"
            },
            notificationTypes: {
              "Request Alert": "Alerte de demande",
              "Event": "Événement",
              "General": "Général"
            },
            userStatus: {
              "True": "Actif",
              "False": "Inactif",
              "Null": "Tous"
            },
            materialTypes: {
              LAB_SUPPLIES: "Fournitures de laboratoire",
              CONSUMABLES: "Consommables"
            },
            unitList: {
              M: "Mètre",
              KG: "Kilogramme",
              G: "Gramme",
              L: "Litre",
              ML: "Millilitre",
              PC: "Pièce"
            }
          },
          persManageMaterials: {
            title: "Gérer la disponibilité du matériel personnel",
            headers: {
              title: "Titre",
              description: "Description",
              quantity: "Quantité",
              status: "Statut"
            },
            availabilityActions: {
              title_available: "Mettre en prêt / don",
              title_unavailable: "Retirer du prêt / don",
              available_content: "Êtes-vous sûr de vouloir rendre le matériel sélectionné à nouveau disponible à l'emprunt ?",
              remove_content: "Êtes-vous sûr de vouloir rendre le matériel sélectionné indisponible à l'emprunt ?",
              btnAvailableText: "Mettre à disposition",
              btnRemoveText: "Rendre indisponible",
              textStatusAvailable: "Disponible",
              textStatusUnavailable: "Indisponible",
              btnCancelText: "Annuler",
              error_message_not_updated: "Certains matériels n'ont pas pu être mis à jour.",
              error_message_try_again: "Impossible de mettre à jour le matériel, veuillez réessayer plus tard",
              succes_message: "Matériel mis à jour avec succès.",
            }
          },
          inventoryMaterials: {
            title: "Catalogue - Matériel",
            btnAdd: "Ajouter",
            
            materialSearchField: {
              placeholder: "Nom du matériel ou Numéro du matériel ou Proprietaire ou Description",
              informationText: "Vous pouvez rechercher un matériel par le nom du matériel, le nom du propriétaire, la description, le numéro du matériel sur le QR code (ex. Matostheque-001, type 001)"
            },

            materialFilterCategory: {
              title: "Filtrer par catégorie",
              resetBtn: "Réinitialiser les filtres",
              sectionConsumables: "Consommables",
              sectionLabSupplies: "Fournitures de laboratoire",
              filterConsumableTypes: {
                FILTERS_FILTRATION_SUPPLIES: "Filtres et matériel de filtration",
                BIOLOGICAL_CONSUMABLES: "Consommables biologiques",
                CHEMICALS: "Produits chimiques",
                SAFETY_EQUIPMENT: "Équipement de sécurité",
                LAB_FURNITURE_FIXTURES: "Mobilier de laboratoire",
                CLEANING_MAINTENANCE_SUPPLIES: "Fournitures de nettoyage et d'entretien"
              },
              filterLabSupplyTypes: {
                COMPUTING: "Informatique",
                ELECTRONICS: "Électronique",
                MECHANICAL: "Mécanique",
                OPTICS_LASER: "Optique ou Laser",
                GAS_FLUIDS: "Gaz ou Fluides",
                BIOLOGICAL: "Biologique",
                CHEMISTRY: "Chimie",
                BOOKS: "Livres",
                OFFICE_BUILDING: "Bureau et Bâtiment",
                Others: "Autres"
              }
            },
            materialListCard: {
              quantity: "Quantité : {{qty}}",
              durationDays: "{{duration}} Jours"
            }
          },
          reqLoanDetails: {
            title: "Détails du prêt",
            btnReturn: "Retour",
            btnApprove: "Approuver",
            btnReject: "Refuser",
            btnCancel: "Annuler",
            unauthorizedText: "Vous n'avez pas l'autorisation d'accéder à cette page.",
            loadingData: "...Chargement des données",
            btnSaveChanges: "Enregistrer les modifications",
            btnDeleteRecord: "Supprimer le dossier de prêt",
            noMaterialFound: "Aucun matériel trouvé !!",
            fields: {
              materialTitle: "Titre du matériel",
              materialType: "Type de matériel",
              status: "Statut",
              borrower: "Emprunteur",
              borrowerEmail: "E-mail de l'emprunteur",
              startingDate: "Date de début",
              duration: "Durée (en jour)",
              quantity: "Quantité",
              location: "Lieu",
              contactPerson: "Personne à contacter",
              contactPersonEmail: "E-mail du contact",
              borrowerNote: "Note de l'emprunteur"
            },
          },
          reqNofitications: {
            title: "Notifications",
            subtitle: "Aucune notification à afficher pour le moment",
            popupView: "Voir tout",
            popupNone: "Aucune notification à afficher.",
            today: "Aujourd'hui",
            loanOfMaterial: "- Prêt du matériel :"
          },
          newLoan: {
            messages: {
              infoLabSupplies: "Vous pouvez emprunter le matériel jusqu'à {{duration}} jours. \n Vous pouvez en emprunter jusqu'à {{quantity}}",
              infoConsumables: "Vous pouvez en emprunter jusqu'à {{quantity}}",
              infoDuration: "Vous pouvez emprunter le matériel jusqu'à {{duration}} jours.",
              errorSubmit: "Impossible d'emprunter. Veuillez vérifier vos données ou réessayer plus tard."
            },
            notifications: {
              ownerPending: "Vous avez une nouvelle demande en attente : {{title}}",
              ownerBooked: "{{name}} a réservé votre matériel : {{title}}.",
              borrowerSuccess: "Vous avez réservé avec succès le matériel : {{title}}."
            }
          },
          timeDifference: {
            secondsAgo: "Il y a {{count}} secondes",
            minutesAgo: "Il y a {{count}} minutes",
            hoursAgo: "Il y a {{count}} heures",
            daysAgo: "Il y a {{count}} jours"
          },
          userManagement: {
            title: "Liste des utilisateurs",
            placeholder: "Recherche par prénom, nom de famille",
            table: {
              filterStatus: "Filtrer par statut :",
              headers: {
                name: "Nom",
                email: "E-mail",
                role: "Rôle",
                lastConnection: "Date de dernière connexion",
                status: "Statut"
              },
              statusActive: "Actif",
              statusNotActive: "Inactif",
              rowsPerPage: "Lignes par page :",
              of: "sur",
              moreThan: "plus de"
            },
            dialog: {
              title: "Désactiver l'utilisateur et transférer le matériel ?",
              content1: "Êtes-vous sûr de vouloir désactiver ",
              content2: " ?",
              content3: "Car si cet utilisateur est désactivé, tout le matériel qu'il possède actuellement sera automatiquement transféré à votre compte Administrateur pour éviter qu'il ne soit perdu.",
              btnCancel: "Annuler",
              btnDeactivate: "Désactiver et transférer"
            },
            toasts: {
              transferSuccess: "Le matériel de {{firstName}} a été transféré avec succès.",
              activeSuccess: "{{firstName}} est maintenant actif.",
              updateError: "Impossible de mettre à jour le statut de l'utilisateur. Veuillez réessayer."
            }
          },
          newMaterial: {
            title: "Nouveau matériel",
            heading: "Ajouter un nouveau matériel",
            form: {
              subheader: "Remplissez les informations du matériel",
              generalInfo: "Informations Générales",
              title: "Titre",
              materialType: "Type de matériel",
              description: "Description",
              descriptionPlaceholder: "Décrivez le matériel ici pour aider les autres ...",
              quantity: "Quantité",
              dynamicInfo: "Informations : {{type}}",
              labSupplyType: "Type de fourniture",
              consumableType: "Type de consommable",
              selectType: "Sélectionnez un type",
              allowedLoanDuration: "Durée de prêt autorisée",
              typeNumberInDays: "(Entrez un nombre en jours.*)",
              typeNumberInDaysLabel: "Entrez un nombre en jours.",
              expirationDate: "Date d'expiration",
              unit: "Unité",
              supplierInfo: "Informations sur le fournisseur",
              ownerPlaceholder: "Propriétaire (activez le compte pour voir votre nom)",
              sharedMaterial: "Matériel partagé",
              selectTeam: "Sélectionnez votre équipe",
              loanInfo: "Informations de prêt",
              location: "Emplacement",
              locationPlaceholder: "Ex. Salle 203",
              askValidation: "Demander une validation",
              enableLoanDuration: "Activer la durée de prêt",
              additionalInfo: "Informations supplémentaires",
              userManualLink: "Lien vers le manuel d'utilisation",
              datasheetLink: "Lien vers la fiche technique du fabricant",
              codeNacre: "Code Nacre",
              purchasePrice: "Prix d'achat (Approximatif)",
              inEuros: "En Euros.",
              picturesSelected: "Photos sélectionnées",
              uploadPictures: "Télécharger des photos",
              maxPhotosNote: "Notez que vous ne pouvez télécharger qu'un maximum de deux photos à la fois !",
              btnCreate: "Créer",
              uploading: "Téléchargement"
            },
            messages: {
              invalidCodeNacre: "Veuillez utiliser un format de Code NACRE valide. Vous pouvez utiliser le lien fourni pour vérifier si besoin.",
              invalidCodeNacreShort: "Veuillez utiliser un format de Code NACRE valide.",
              compressImages: "Veuillez envisager de compresser vos images ou réessayer ultérieurement.",
              successCreate: "Matériel créé avec succès ! Vous allez être redirigé prochainement."
            }
          },
          materialDetailCalendar: {
            hiddenUser: "Utilisateur masqué",
            labels: {
              name: "Nom :",
              contact: "Contact :",
              location: "Emplacement :",
              quantity: "Quantité :"
            },
            toolbar: {
              today: "Aujourd'hui",
              previous: "Précédent",
              next: "Suivant",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
              agenda: "Agenda",
              showMore: "plus"
            }
          },
          materialDetailEdit: {
            cardTitle: "Détails",
            cardSubheader: "Les informations peuvent être modifiées",
            loading: "...Chargement",
            fields: {
              title: "Titre",
              contactPerson: "Personne à contacter",
              ownerLabel: "Personne à contacter (activez le compte pour voir votre nom)",
              type: "Type",
              subType: "Sous-type",
              expirationDate: "Date d'expiration",
              duration: "Durée",
              availableQuantity: "Quantité disponible",
              description: "Description",
              location: "Emplacement / adresse",
              manualLink: "Lien vers le manuel d'utilisation",
              datasheetLink: "Lien vers la fiche technique du fabricant"
            },
            helpers: {
              typeDisabled: "Ce champ ne peut pas être modifié.",
              days: "jours",
              validationNeededCheck: "Si coché, une validation de la personne à contacter sera nécessaire.",
              validationNeededText: "Une validation de la personne à contacter est nécessaire."
            },
            buttons: {
              saveDetails: "Enregistrer les détails"
            },
            messages: {
              successUpdate: "Détails du matériel mis à jour avec succès !",
              errorSubmit: "Erreur lors de la soumission : {{error}}"
            }
          },
          materialDetailViewer: {
            confirmDelete: "Êtes-vous sûr de vouloir supprimer cette photo ?",
            noPicturesAdded: "Aucune photo ajoutée pour le moment.",
            deleteTooltip: "Supprimer la photo",
            filesSelected: "Fichiers sélectionnés",
            choosePictures: "Choisir des photos",
            upload: "Télécharger",
            errors: {
              deleteFailed: "Échec de la suppression de l'image.",
              deleteException: "Erreur lors de la tentative de suppression de la photo : {{error}}",
              noPictures: "Aucune photo à télécharger !",
              uploadException: "Erreur lors de la tentative de téléchargement des photos : {{error}}"
            },
            success: {
              delete: "Photo supprimée avec succès !",
              upload: "Photos téléchargées avec succès !"
            }
          },
          materialDetailOverview: {
            toasts: {
              invalidUrl: "L'URL fournie n'est pas valide.",
              noManual: "Aucun lien de manuel fourni.",
              noDatasheet: "Aucun lien de fiche technique fourni."
            },
            tooltips: {
              manual: "Manuel",
              datasheet: "Fiche technique"
            },
            labels: {
              contact: "Contact :",
              email: "E-mail :",
              materialNumber: "Numéro du matériel :",
              available: "Disponible",
              notAvailable: "Indisponible"
            },
            buttons: {
              loadingDocument: "Chargement du document",
              printPdf: "Imprimer le QRCode en PDF",
              printDirect: "Imprimer le QRCode et le Numéro"
            }
          },
          materialDetailsPage: {
            pageTitle: "Détails du matériel",
            buttons: {
              bookMaterial: "Réserver le matériel",
              notAvailableForLoan: "Non disponible pour le prêt",
              deleteMaterial: "Supprimer le matériel",
              cancel: "Annuler"
            },
            toasts: {
              deleteError: "Impossible de supprimer le matériel, réessayez plus tard",
              deleteSuccess: "Le matériel a été supprimé avec succès",
              updateStatusError: "Impossible de mettre à jour le statut du matériel.",
              success_removed_loan: "Le matériel a été retiré du prêt avec succès",
              success_added_loan: "Le matériel a été mis en prêt avec succès",
              success_removed_donation: "Le matériel a été retiré du don avec succès",
              success_added_donation: "Le matériel a été mis en don avec succès",
              updateError: "Impossible de mettre à jour le matériel, réessayez plus tard"
            },
            dialog: {
              deleteTitle: "Supprimer le matériel",
              deleteContent: "Êtes-vous sûr de vouloir supprimer ce matériel ?",
              deleteBtn: "Supprimer",
              removeLoanTitle: "Retirer du prêt",
              putLoanTitle: "Mettre en prêt",
              removeLoanContent: "Êtes-vous sûr de vouloir retirer ce matériel du prêt ?",
              putLoanContent: "Êtes-vous sûr de vouloir rendre ce matériel disponible pour le prêt ?",
              removeLoanBtn: "Retirer du prêt",
              putLoanBtn: "Mettre en prêt",
              removeDonationTitle: "Retirer du don",
              putDonationTitle: "Mettre en don",
              removeDonationContent: "Êtes-vous sûr de vouloir retirer ce matériel du don ?",
              putDonationContent: "Êtes-vous sûr de vouloir rendre ce matériel disponible pour le don ?",
              removeDonationBtn: "Retirer du don",
              putDonationBtn: "Mettre en don"
            }
          },
          createLoan: {
            pageTitle: "Emprunt",
            title: "Emprunter un matériel",
            card: {
              title: "Informations sur l'emprunt",
              subheader: "Remplissez les informations pour soumettre votre demande",
              fields: {
                materials: "Matériels *",
                materialsPlaceholder: "Sélectionnez un matériel",
                startDate: "Date de début *",
                endDate: "Date de fin *",
                quantity: "Quantité",
                quantityPlaceholder: "Ex. 1",
                location: "Lieu",
                locationPlaceholder: "Ex. Salle 203",
                note: "Note à la personne à contacter",
                notePlaceholder: "Écrivez votre message à la personne à contacter ici..."
              },
              errors: {
                material: "Veuillez sélectionner un matériel",
                startDate: "La date de début est obligatoire",
                endDate: "La date de fin est obligatoire",
                location: "Veuillez sélectionner un lieu"
              },
              buttons: {
                borrow: "Emprunter"
              }
            }
          },
          overviewNotification: {
            title: "Notification",
            date: "Date:"
          }

        },
      },
    },
    lng: savedLanguage, 
    fallbackLng: "en", 
    interpolation: {
      escapeValue: false, 
    },
});

export default i18n;