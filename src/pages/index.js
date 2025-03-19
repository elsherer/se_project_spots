import "./index.css";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import { setButtonText } from "../utils/helpers.js";
import logoSrc from "../images/logo.svg";
import avatarSrc from "../images/avatar.jpg";
import editIconSrc from "../images/edit-icon.svg";
import plusIconSrc from "../images/plus.svg";

import Api from "../utils/Api.js";

document.getElementById("header-icon").src = logoSrc;
document.querySelector(".profile__avatar").src = avatarSrc;
document.getElementById("edit-icon").src = editIconSrc;
document.getElementById("plus-icon").src = plusIconSrc;

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "dc482f24-a5c6-45f6-890e-6b19a3644562",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log(cards, userInfo);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
    document.querySelector(".profile__avatar").src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-btn");

const avatarEditButton = document.querySelector(".profile__avatar-btn");

const cardEditButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const profileAvatar = document.querySelector(".profile__avatar");

const cancelBtn = document.querySelector(".modal__submit-btn_type_cancel");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

const closeButtons = document.querySelectorAll(".modal__close-btn");
const closeOverlayModals = document.querySelectorAll(".modal");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", () => {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");
    if (isLiked) {
      api
        .changeLikeStatus(data._id)
        .then((res) => {
          cardLikeBtn.classList.remove("card__like-btn_liked");
        })
        .catch(console.error);
    } else {
      api
        .changeLikeStatus(data._id)
        .then((res) => {
          cardLikeBtn.classList.add("card__like-btn_liked");
        })
        .catch(console.error);
    }
  });

  cardDeleteBtn.addEventListener("click", () => {
    openModal(deleteModal);
    deleteModal.dataset.cardId = data._id;

    cardElement.dataset.cardId = data._id;
  });

  return cardElement;
}

function handleDeleteConfirmation() {
  const cardId = deleteModal.dataset.cardId;
  const cardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);

  const deleteBtn = document.querySelector(".modal__submit-btn_type_delete");
  setButtonText(deleteBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteBtn, false, "Delete", "Deleting...");
    });
}

const deleteForm = deleteModal.querySelector(".modal__form");
deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  handleDeleteConfirmation();
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })

    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo({ avatar: avatarLinkInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
      avatarForm.reset();
      disableButton(avatarSubmitBtn, settings);
    });
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],

    settings
  );
  openModal(editModal);
});

cardEditButton.addEventListener("click", () => {
  openModal(cardModal);
});

avatarEditButton.addEventListener("click", () => {
  resetValidation(avatarForm, [avatarLinkInput], settings);
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

cancelBtn.addEventListener("click", () => {
  const modal = document.querySelector(".modal_opened");
  closeModal(modal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

closeOverlayModals.forEach((modal) => {
  modal.addEventListener("click", function (evt) {
    const isOutside = evt.target.classList.contains("modal");
    if (isOutside) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
