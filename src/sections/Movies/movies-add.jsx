

const GetImageUrl = (Session) => {
    setLoading(true);
    const url = `${REACT_APP_HOST_URL}${IMAGE_DISPLAY_URL}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(Session))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setLoading(false);
        if (json.success) {
          localStorage.setItem(
            "imageUrl",
            JSON.stringify(json)
          );
          router.push('/dashboard');
        } else if (json.success === false){
          if (json.code === 2 || json.code === "2") {
            LogOutMethod(navigate);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error);
      })
  }




