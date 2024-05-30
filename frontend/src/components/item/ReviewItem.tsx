import { useEffect, useState } from "react";

const ReviewItem = ({reviewList}:any) => {
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        setRows(reviewList);
    }, [reviewList])

return (
<>
    {rows.map((value, index) => (
        <div>
            <div className="comment_item" style={{display:'block' , position:'relative', padding:'20px 10px', boxSizing:'border-box', borderTop:'1px solid #eaeaea'}}>
                <div className="comment_header" style={{marginBottom:'16px' }}>
                    <div className="left_area">
                        <div className="user_info_box">
                            <span className="info_item">{value.writerNickname} 님</span>
                            <span className="gap"> | </span>
                            <span className="info_item">{value.registerDate}</span>
                            {/* <span className="gap"> | </span>
                            <span className="info_item">
                                <button className="btn_comment_util" type="button" data-role="report">
                                    <span className="text">신고/차단</span>
                                </button>
                            </span> */}
                        </div>
                    </div>
                    <div className="right_area">
                        <div className="review_summary_wrap">
                            <div className="rating-container theme-krajee-gly rating-sm rating-animate rating-disabled">
                                <div className="clear-rating " title="초기화">
                                    <i className="glyphicon glyphicon-minus-sign"/>
                                </div>
                                <div className="rating-stars">
                                    <span className="empty-stars">
                                        <span className="star" title="One Star">
                                            <i className="glyphicon glyphicon-star-empty"/>
                                        </span>
                                        <span className="star" title="Two Stars">
                                            <i className="glyphicon glyphicon-star-empty"/>
                                        </span>
                                        <span className="star" title="Three Stars">
                                            <i className="glyphicon glyphicon-star-empty"/>
                                        </span>
                                        <span className="star" title="Four Stars">
                                            <i className="glyphicon glyphicon-star-empty"/>
                                        </span>
                                    </span>
                                    <span className="filled-stars" style={{"width" :'100%' }}>
                                        <span className="star" title="One Star">
                                            <i className="glyphicon glyphicon-star"/>
                                        </span>
                                        <span className="star" title="Two Stars">
                                            <i className="glyphicon glyphicon-star"/>
                                        </span>
                                        <span className="star" title="Three Stars">
                                            <i className="glyphicon glyphicon-star"/>
                                        </span>
                                        <span className="star" title="Four Stars">
                                            <i className="glyphicon glyphicon-star"/>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="comment_contents">
                    <div className="comment_contents_inner">
                        <div className="comment_view_wrap">
                            <div className="comment_text_box">
                                <div className="comment_text">{value.contents}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="comment_footer" style={{marginBottom:'16px' }}></div>
            </div>
        </div>
    ))}
</>
)

}

export default ReviewItem;