import React from "react"
import ContentLoader from "react-content-loader"

const Skeleton = (props) => (
  <ContentLoader 
    speed={2}
    width={235}
    height={400}
    viewBox="0 0 235 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="119" cy="110" r="90" /> 
    <rect x="3" y="213" rx="9" ry="9" width="235" height="21" /> 
    <rect x="1" y="254" rx="10" ry="10" width="235" height="85" /> 
    <rect x="2" y="359" rx="9" ry="9" width="105" height="21" /> 
    <rect x="137" y="346" rx="20" ry="20" width="92" height="45" /> 
    <rect x="207" y="375" rx="0" ry="0" width="4" height="8" />
  </ContentLoader>
)

export default Skeleton;