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