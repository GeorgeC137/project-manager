import { ColorRing } from "react-loader-spinner";

export default function Spinner({ }) {
    return (
        <ColorRing
            visible={true}
            height="20"
            width="20"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
    )
}