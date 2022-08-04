import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWithExpiry } from "../../../helpers/localStorage";
import { userActions as Actions } from "../../../store/users";
import { useParams } from "react-router-dom";

import Alerts from "../../../components/multitools/Alerts";
import Preloader from "../../../components/Preloader";

import EditForm from "./Form";

const Component = () => {
  let { _id } = useParams();
  const name = "getUser";
  const stateName = "users_data";

  const dispatch = useDispatch();
  const itemQuery = (payload) => dispatch(Actions[name](payload));
  const itemRes = useSelector((state) => state[stateName][name]);
  const status = itemRes?.status ?? "";
  const error = itemRes?.errors ?? "Error";
  const item = itemRes?.data ?? {};
  const items = itemRes?.data ?? [];

  useEffect(() => {
    const accessToken = getWithExpiry("accessToken");
    if (accessToken) {
      const payload = {
        id: _id,
        data: {},
        token: accessToken,
      };
      itemQuery(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // is loading
  if (["", "initial", "loading"].includes(status)) {
    return <Preloader show={true} />;
  }

  if (["fail", "error"].includes(status)) {
    return (
      <div className="mt-3 mb-3">
        <Alerts alerts={error} />
      </div>
    );
  }

  return <EditForm item={item} items={items} />;
};

export default Component;
