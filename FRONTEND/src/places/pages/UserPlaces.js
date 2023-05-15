import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const [loadedPlaces, setLoadedplaces] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const reponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );

        const responseData = await reponse.json();
        console.log(reponse);

        if (!reponse.ok) {
          if (reponse.status === 404) setLoadedplaces([]);
          else throw new Error(responseData.message);
        }

        if (reponse.ok) setLoadedplaces(responseData.places);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
      }
    };

    sendRequest();
  }, [userId]);

  const clearError = () => {
    setError(null);
  };

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedplaces((prevPlaces) => {
      prevPlaces.filter((place) => place.id !== deletedPlaceId);
    });
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
