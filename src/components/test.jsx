import React from 'react';
import { Player, ControlBar, ClosedCaptionButton, BigPlayButton  } from 'video-react';
const Test = ({test}) => {

    console.log('testss', test)
return ( 
<div>
    
  <div className={'video-wrap'}>
   <Player videoId="video-1" fluid={false} width={700} height={300}>
     <source
       src="//d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4"
       type="video/mp4" 
     />
     <BigPlayButton position="center" />
     <ControlBar autoHide={false} pause={true}>
       <ClosedCaptionButton order={7} />
     </ControlBar>
   </Player>

     </div>
</div>
 )
};

export default Test;