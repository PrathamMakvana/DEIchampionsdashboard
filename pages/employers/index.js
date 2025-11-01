"use client";
import { getJobs } from "@/api/job";
import Layout from "@/components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { requestForToken } from "@/utils/firebase";
import { saveFcmToken } from "@/api/notification";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserTie,
} from "react-icons/fa";
import { getAuthUser } from "@/api/auth";

export default function EmployerDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { jobs, loading } = useSelector((state) => state.job);

  // Fetch jobs
  useEffect(() => {
    dispatch(getJobs());
    dispatch(getAuthUser());
  }, [dispatch]);

  // Register FCM token
  useEffect(() => {
    const registerFcmToken = async () => {
      const token = await requestForToken();
      if (token && user?._id) {
        await dispatch(
          saveFcmToken(
            { fcmToken: token, userId: user._id },
            {
              showSuccess: (msg) => toast.success(msg),
              showError: (msg) => toast.error(msg),
            }
          )
        );
      }
    };
    registerFcmToken();
  }, [user?._id, dispatch]);

  // Compute stats dynamically
  const stats = useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return {
        totalJobs: 0,
        openJobs: 0,
        closedJobs: 0,
        draftJobs: 0,
        totalApplicants: 0,
      };
    }

    const openJobs = jobs.filter((j) => j.status === "open").length;
    const closedJobs = jobs.filter((j) => j.status === "closed").length;
    const draftJobs = jobs.filter((j) => j.status === "draft").length;
    const totalApplicants = jobs.reduce(
      (sum, j) => sum + (j.applicants?.length || 0),
      0
    );

    return {
      totalJobs: jobs.length,
      openJobs,
      closedJobs,
      draftJobs,
      totalApplicants,
    };
  }, [jobs]);

  const iconColor = "#007bff"; // Blue tone

  // Dashboard cards with links
  const cards = [
    {
      title: "All Jobs",
      count: stats.totalJobs,
      icon: <FaClipboardList size={40} color={iconColor} />,
      link: "/employers/manage-jobs",
    },
    {
      title: "Open Jobs",
      count: stats.openJobs,
      icon: <FaCheckCircle size={40} color={iconColor} />,
      link: "/employers/manage-jobs?filter=open",
    },
    {
      title: "Closed Jobs",
      count: stats.closedJobs,
      icon: <FaTimesCircle size={40} color={iconColor} />,
      link: "/employers/manage-jobs?filter=closed",
    },
    {
      title: "Draft Jobs",
      count: stats.draftJobs,
      icon: <FaClock size={40} color={iconColor} />,
      link: "/employers/manage-jobs?filter=draft",
    },
    {
      title: "Total Applicants",
      count: stats.totalApplicants,
      icon: <FaUserTie size={40} color={iconColor} />,
      link: "/employers/manage-jobs",
    },
  ];

  return (
    <Layout breadcrumbTitle="Dashboard" breadcrumbActive="Dashboard">
      <div className="col-xxl-12 col-xl-12 col-lg-12">
        <div className="section-box">
          {loading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              Loading your dashboard...
            </div>
          )}

          {!loading && (
            <div className="row">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-4"
                >
                  <Link href={card.link}>
                    <div
                      className="card-style-1 hover-up cursor-pointer transition-transform hover:-translate-y-1 text-center d-flex flex-column align-items-center justify-content-center"
                      style={{
                        height: "200px",
                        borderRadius: "12px",
                        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                        padding: "20px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div className="mb-3">{card.icon}</div>
                      <h3 className="fw-bold mb-1">{card.count}</h3>
                      <p className="color-text-paragraph-2 mb-0">
                        {card.title}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// import { getAuthUser } from "@/api/auth";
// import VacancyChart from "@/components/elements/VacancyChart";
// import Layout from "@/components/layout/Layout";
// import BrandSlider from "@/components/slider/BrandSlider";
// import { Menu } from "@headlessui/react";
// import Link from "next/link";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { requestForToken } from "@/utils/firebase";
// import { saveFcmToken } from "@/api/notification";
// import { toast } from "react-toastify";

// export default function Home() {
//   const data = getAuthUser();
//   console.log("🚀data --->", data);
//      const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     const registerFcmToken = async () => {
//       const token = await requestForToken();
//       if (token && user?._id) {
//         await dispatch(
//           saveFcmToken(
//             { fcmToken: token, userId: user._id },
//             {
//               showSuccess: (msg) => toast.success(msg),
//               showError: (msg) => toast.error(msg),
//             }
//           )
//         );
//       }
//     };

//     registerFcmToken();
//   }, [user?._id, dispatch]);

//   return (
//     <>
//       <Layout breadcrumbTitle="Dashboard" breadcrumbActive="Dashboard">
//         <div className="col-xxl-12 col-xl-12 col-lg-12">
//           <div className="section-box">
//             <div className="row">
//               <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
//                 <div className="card-style-1 hover-up">
//                   <div className="card-image">
//                     {" "}
//                     <img
//                       src="../../assets/imgs/page/dashboard/computer.svg"
//                       alt="jobBox"
//                     />
//                   </div>
//                   <div className="card-info">
//                     <div className="card-title">
//                       <h3>
//                         1568
//                         <span className="font-sm status up">
//                           25<span>%</span>
//                         </span>
//                       </h3>
//                     </div>
//                     <p className="color-text-paragraph-2">
//                       Interview Schedules
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
//                 <div className="card-style-1 hover-up">
//                   <div className="card-image">
//                     {" "}
//                     <img
//                       src="../assets/imgs/page/dashboard/bank.svg"
//                       alt="jobBox"
//                     />
//                   </div>
//                   <div className="card-info">
//                     <div className="card-title">
//                       <h3>
//                         284
//                         <span className="font-sm status up">
//                           5<span>%</span>
//                         </span>
//                       </h3>
//                     </div>
//                     <p className="color-text-paragraph-2">Applied Jobs</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
//                 <div className="card-style-1 hover-up">
//                   <div className="card-image">
//                     {" "}
//                     <img
//                       src="../assets/imgs/page/dashboard/lamp.svg"
//                       alt="jobBox"
//                     />
//                   </div>
//                   <div className="card-info">
//                     <div className="card-title">
//                       <h3>
//                         136
//                         <span className="font-sm status up">
//                           12<span>%</span>
//                         </span>
//                       </h3>
//                     </div>
//                     <p className="color-text-paragraph-2">Task Bids Won</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
//                 <div className="card-style-1 hover-up">
//                   <div className="card-image">
//                     {" "}
//                     <img
//                       src="../assets/imgs/page/dashboard/headphone.svg"
//                       alt="jobBox"
//                     />
//                   </div>
//                   <div className="card-info">
//                     <div className="card-title">
//                       <h3>
//                         985
//                         <span className="font-sm status up">
//                           5<span>%</span>
//                         </span>
//                       </h3>
//                     </div>
//                     <p className="color-text-paragraph-2">Application Sent</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
//                 <div className="card-style-1 hover-up">
//                   <div className="card-image">
//                     {" "}
//                     <img
//                       src="../assets/imgs/page/dashboard/look.svg"
//                       alt="jobBox"
//                     />
//                   </div>
//                   <div className="card-info">
//                     <div className="card-title">
//                       <h3>
//                         165
//                         <span className="font-sm status up">
//                           15<span>%</span>
//                         </span>
//                       </h3>
//                     </div>
//                     <p className="color-text-paragraph-2">Profile Viewed</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
//                 <div className="card-style-1 hover-up">
//                   <div className="card-image">
//                     {" "}
//                     <img
//                       src="../assets/imgs/page/dashboard/open-file.svg"
//                       alt="jobBox"
//                     />
//                   </div>
//                   <div className="card-info">
//                     <div className="card-title">
//                       <h3>
//                         2356<span className="font-sm status down">- 2%</span>
//                       </h3>
//                     </div>
//                     <p className="color-text-paragraph-2">New Messages</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
//                 <div className="card-style-1 hover-up">
//                   <div className="card-image">
//                     {" "}
//                     <img
//                       src="../assets/imgs/page/dashboard/doc.svg"
//                       alt="jobBox"
//                     />
//                   </div>
//                   <div className="card-info">
//                     <div className="card-title">
//                       <h3>
//                         254
//                         <span className="font-sm status up">
//                           2<span>%</span>
//                         </span>
//                       </h3>
//                     </div>
//                     <p className="color-text-paragraph-2">Articles Added</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
//                 <div className="card-style-1 hover-up">
//                   <div className="card-image">
//                     {" "}
//                     <img
//                       src="../assets/imgs/page/dashboard/man.svg"
//                       alt="jobBox"
//                     />
//                   </div>
//                   <div className="card-info">
//                     <div className="card-title">
//                       <h3>
//                         548
//                         <span className="font-sm status up">
//                           48<span>%</span>
//                         </span>
//                       </h3>
//                     </div>
//                     <p className="color-text-paragraph-2">CV Added</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* <div className="section-box">
//             <div className="container">
//               <div className="panel-white">
//                 <div className="panel-head">
//                   <h5>Vacancy Stats</h5>
//                   <Menu as="div">
//                     <Menu.Button as="a" className="menudrop" />
//                     <Menu.Items
//                       as="ul"
//                       className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
//                       style={{ right: "0", left: "auto" }}
//                     >
//                       <li>
//                         <Link className="dropdown-item active" href="#">
//                           Add new
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Settings
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Actions
//                         </Link>
//                       </li>
//                     </Menu.Items>
//                   </Menu>
//                 </div>
//                 <div className="panel-body">
//                   <VacancyChart />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="section-box">
//             <div className="container">
//               <div className="panel-white">
//                 <div className="panel-head">
//                   <h5>Latest Jobs</h5>
//                   <Menu as="div">
//                     <Menu.Button as="a" className="menudrop" />
//                     <Menu.Items
//                       as="ul"
//                       className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
//                       style={{ right: "0", left: "auto" }}
//                     >
//                       <li>
//                         <Link className="dropdown-item active" href="#">
//                           Add new
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Settings
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Actions
//                         </Link>
//                       </li>
//                     </Menu.Items>
//                   </Menu>
//                 </div>
//                 <div className="panel-body">
//                   <div className="card-style-2 hover-up">
//                     <div className="card-head">
//                       <div className="card-image">
//                         {" "}
//                         <img
//                           src="../assets/imgs/page/dashboard/img1.png"
//                           alt="jobBox"
//                         />
//                       </div>
//                       <div className="card-title">
//                         <h6>Senior Full Stack Engineer, Creator Success</h6>
//                         <span className="job-type">Full time</span>
//                         <span className="time-post">3mins ago</span>
//                         <span className="location">New York, US</span>
//                       </div>
//                     </div>
//                     <div className="card-tags">
//                       {" "}
//                       <a className="btn btn-tag">Figma</a>
//                       <a className="btn btn-tag">Adobe XD</a>
//                     </div>
//                     <div className="card-price">
//                       <strong>$300</strong>
//                       <span className="hour">/Hour</span>
//                     </div>
//                   </div>
//                   <div className="card-style-2 hover-up">
//                     <div className="card-head">
//                       <div className="card-image">
//                         {" "}
//                         <img
//                           src="../assets/imgs/page/dashboard/img2.png"
//                           alt="jobBox"
//                         />
//                       </div>
//                       <div className="card-title">
//                         <h6>Senior Full Stack Engineer, Creator Success</h6>
//                         <span className="job-type">Full time</span>
//                         <span className="time-post">3mins ago</span>
//                         <span className="location">Chicago, US</span>
//                       </div>
//                     </div>
//                     <div className="card-tags">
//                       {" "}
//                       <a className="btn btn-tag">Figma</a>
//                       <a className="btn btn-tag">Adobe XD</a>
//                       <a className="btn btn-tag">PSD</a>
//                     </div>
//                     <div className="card-price">
//                       <strong>$650</strong>
//                       <span className="hour">/Hour</span>
//                     </div>
//                   </div>
//                   <div className="card-style-2 hover-up">
//                     <div className="card-head">
//                       <div className="card-image">
//                         {" "}
//                         <img
//                           src="../assets/imgs/page/dashboard/img3.png"
//                           alt="jobBox"
//                         />
//                       </div>
//                       <div className="card-title">
//                         <h6>Lead Product/UX/UI Designer Role</h6>
//                         <span className="job-type">Full time</span>
//                         <span className="time-post">3mins ago</span>
//                         <span className="location">Paris, France</span>
//                       </div>
//                     </div>
//                     <div className="card-tags">
//                       {" "}
//                       <a className="btn btn-tag">Figma</a>
//                       <a className="btn btn-tag">Adobe XD</a>
//                       <a className="btn btn-tag">PSD</a>
//                     </div>
//                     <div className="card-price">
//                       <strong>$1200</strong>
//                       <span className="hour">/Hour</span>
//                     </div>
//                   </div>
//                   <div className="card-style-2 hover-up">
//                     <div className="card-head">
//                       <div className="card-image">
//                         {" "}
//                         <img
//                           src="../assets/imgs/page/dashboard/img4.png"
//                           alt="jobBox"
//                         />
//                       </div>
//                       <div className="card-title">
//                         <h6>Marketing Graphic Designer</h6>
//                         <span className="job-type">Full time</span>
//                         <span className="time-post">3mins ago</span>
//                         <span className="location">Tokyto, Japan</span>
//                       </div>
//                     </div>
//                     <div className="card-tags">
//                       {" "}
//                       <a className="btn btn-tag">Figma</a>
//                       <a className="btn btn-tag">Adobe XD</a>
//                       <a className="btn btn-tag">PSD</a>
//                     </div>
//                     <div className="card-price">
//                       <strong>$580</strong>
//                       <span className="hour">/Hour</span>
//                     </div>
//                   </div>
//                   <div className="card-style-2 hover-up">
//                     <div className="card-head">
//                       <div className="card-image">
//                         {" "}
//                         <img
//                           src="../assets/imgs/page/dashboard/img5.png"
//                           alt="jobBox"
//                         />
//                       </div>
//                       <div className="card-title">
//                         <h6>Director, Product Design - Creator</h6>
//                         <span className="job-type">Full time</span>
//                         <span className="time-post">3mins ago</span>
//                         <span className="location">Ha Noi, Vietnam</span>
//                       </div>
//                     </div>
//                     <div className="card-tags">
//                       {" "}
//                       <a className="btn btn-tag">Figma</a>
//                       <a className="btn btn-tag">Adobe XD</a>
//                       <a className="btn btn-tag">PSD</a>
//                     </div>
//                     <div className="card-price">
//                       <strong>$1500</strong>
//                       <span className="hour">/Hour</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//         </div>
//         {/* <div className="col-xxl-4 col-xl-5 col-lg-5">
//           <div className="section-box">
//             <div className="container">
//               <div className="panel-white">
//                 <div className="panel-head">
//                   <h5>Top Candidates</h5>
//                   <Menu as="div">
//                     <Menu.Button as="a" className="menudrop" />
//                     <Menu.Items
//                       as="ul"
//                       className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
//                       style={{ right: "0", left: "auto" }}
//                     >
//                       <li>
//                         <Link className="dropdown-item active" href="#">
//                           Add new
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Settings
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Actions
//                         </Link>
//                       </li>
//                     </Menu.Items>
//                   </Menu>
//                 </div>
//                 <div className="panel-body">
//                   <div className="card-style-3 hover-up">
//                     <div className="card-image online">
//                       <img
//                         src="../assets/imgs/page/dashboard/avata1.png"
//                         alt="jobBox"
//                       />
//                     </div>
//                     <div className="card-title">
//                       <h6>Robert Fox</h6>
//                       <span className="job-position">UI/UX Designer</span>
//                     </div>
//                     <div className="card-location">
//                       {" "}
//                       <span className="location">Chicago, US</span>
//                     </div>
//                     <div className="card-rating">
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <span className="font-xs color-text-mutted">(65)</span>
//                     </div>
//                   </div>
//                   <div className="card-style-3 hover-up">
//                     <div className="card-image online">
//                       <img
//                         src="../assets/imgs/page/dashboard/avata2.png"
//                         alt="jobBox"
//                       />
//                     </div>
//                     <div className="card-title">
//                       <h6>Cody Fisher</h6>
//                       <span className="job-position">Network Engineer</span>
//                     </div>
//                     <div className="card-location">
//                       {" "}
//                       <span className="location">New York, US</span>
//                     </div>
//                     <div className="card-rating">
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <span className="font-xs color-text-mutted">(65)</span>
//                     </div>
//                   </div>
//                   <div className="card-style-3 hover-up">
//                     <div className="card-image online">
//                       <img
//                         src="../assets/imgs/page/dashboard/avata3.png"
//                         alt="jobBox"
//                       />
//                     </div>
//                     <div className="card-title">
//                       <h6>Jane Cooper</h6>
//                       <span className="job-position">Content Manager</span>
//                     </div>
//                     <div className="card-location">
//                       {" "}
//                       <span className="location">Chicago, US</span>
//                     </div>
//                     <div className="card-rating">
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <span className="font-xs color-text-mutted">(65)</span>
//                     </div>
//                   </div>
//                   <div className="card-style-3 hover-up">
//                     <div className="card-image online">
//                       <img
//                         src="../assets/imgs/page/dashboard/avata4.png"
//                         alt="jobBox"
//                       />
//                     </div>
//                     <div className="card-title">
//                       <h6>Jerome Bell</h6>
//                       <span className="job-position">Frontend Developer</span>
//                     </div>
//                     <div className="card-location">
//                       {" "}
//                       <span className="location">Chicago, US</span>
//                     </div>
//                     <div className="card-rating">
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <span className="font-xs color-text-mutted">(65)</span>
//                     </div>
//                   </div>
//                   <div className="card-style-3 hover-up">
//                     <div className="card-image online">
//                       <img
//                         src="../assets/imgs/page/dashboard/avata5.png"
//                         alt="jobBox"
//                       />
//                     </div>
//                     <div className="card-title">
//                       <h6>Floyd Miles</h6>
//                       <span className="job-position">NodeJS Dev</span>
//                     </div>
//                     <div className="card-location">
//                       {" "}
//                       <span className="location">Chicago, US</span>
//                     </div>
//                     <div className="card-rating">
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <img
//                         src="../assets/imgs/page/dashboard/star.svg"
//                         alt="jobBox"
//                       />{" "}
//                       <span className="font-xs color-text-mutted">(65)</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="section-box">
//             <div className="container">
//               <div className="panel-white">
//                 <div className="panel-head">
//                   <h5>Top Recruiters</h5>
//                   <Menu as="div">
//                     <Menu.Button as="a" className="menudrop" />
//                     <Menu.Items
//                       as="ul"
//                       className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
//                       style={{ right: "0", left: "auto" }}
//                     >
//                       <li>
//                         <Link className="dropdown-item active" href="#">
//                           Add new
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Settings
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Actions
//                         </Link>
//                       </li>
//                     </Menu.Items>
//                   </Menu>
//                 </div>
//                 <div className="panel-body">
//                   <div className="row">
//                     <div className="col-lg-6 col-md-6 pr-5 pl-5">
//                       <div className="card-style-4 hover-up">
//                         <div className="d-flex">
//                           <div className="card-image">
//                             <img
//                               src="../assets/imgs/page/dashboard/avata1.png"
//                               alt="jobBox"
//                             />
//                           </div>
//                           <div className="card-title">
//                             <h6>Robert Fox</h6>
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <span className="font-xs color-text-mutted">
//                               (65)
//                             </span>
//                           </div>
//                         </div>
//                         <div className="card-location d-flex">
//                           <span className="location">Red, CA</span>
//                           <span className="jobs-number">25 Open Jobs</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-lg-6 col-md-6 pr-5 pl-5">
//                       <div className="card-style-4 hover-up">
//                         <div className="d-flex">
//                           <div className="card-image">
//                             <img
//                               src="../assets/imgs/page/dashboard/avata2.png"
//                               alt="jobBox"
//                             />
//                           </div>
//                           <div className="card-title">
//                             <h6>Cody Fisher</h6>
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <span className="font-xs color-text-mutted">
//                               (65)
//                             </span>
//                           </div>
//                         </div>
//                         <div className="card-location d-flex">
//                           <span className="location">Chicago, US</span>
//                           <span className="jobs-number">25 Open Jobs</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-lg-6 col-md-6 pr-5 pl-5">
//                       <div className="card-style-4 hover-up">
//                         <div className="d-flex">
//                           <div className="card-image">
//                             <img
//                               src="../assets/imgs/page/dashboard/avata3.png"
//                               alt="jobBox"
//                             />
//                           </div>
//                           <div className="card-title">
//                             <h6>Jane Cooper</h6>
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <span className="font-xs color-text-mutted">
//                               (65)
//                             </span>
//                           </div>
//                         </div>
//                         <div className="card-location d-flex">
//                           <span className="location">Austin, TX</span>
//                           <span className="jobs-number">25 Open Jobs</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-lg-6 col-md-6 pr-5 pl-5">
//                       <div className="card-style-4 hover-up">
//                         <div className="d-flex">
//                           <div className="card-image">
//                             <img
//                               src="../assets/imgs/page/dashboard/avata4.png"
//                               alt="jobBox"
//                             />
//                           </div>
//                           <div className="card-title">
//                             <h6>Jerome Bell</h6>
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <span className="font-xs color-text-mutted">
//                               (65)
//                             </span>
//                           </div>
//                         </div>
//                         <div className="card-location d-flex">
//                           <span className="location">Remote</span>
//                           <span className="jobs-number">25 Open Jobs</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-lg-6 col-md-6 pr-5 pl-5">
//                       <div className="card-style-4 hover-up">
//                         <div className="d-flex">
//                           <div className="card-image">
//                             <img
//                               src="../assets/imgs/page/dashboard/avata5.png"
//                               alt="jobBox"
//                             />
//                           </div>
//                           <div className="card-title">
//                             <h6>Floyd Miles</h6>
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <span className="font-xs color-text-mutted">
//                               (65)
//                             </span>
//                           </div>
//                         </div>
//                         <div className="card-location d-flex">
//                           <span className="location">Boston, US</span>
//                           <span className="jobs-number">25 Open Jobs</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-lg-6 col-md-6 pr-5 pl-5">
//                       <div className="card-style-4 hover-up">
//                         <div className="d-flex">
//                           <div className="card-image">
//                             <img
//                               src="../assets/imgs/page/dashboard/avata1.png"
//                               alt="jobBox"
//                             />
//                           </div>
//                           <div className="card-title">
//                             <h6>Devon Lane</h6>
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />
//                             <img
//                               src="../assets/imgs/page/dashboard/star-none.svg"
//                               alt="jobBox"
//                             />{" "}
//                             <span className="font-xs color-text-mutted">
//                               (65)
//                             </span>
//                           </div>
//                         </div>
//                         <div className="card-location d-flex">
//                           <span className="location">Chicago, US</span>
//                           <span className="jobs-number">25 Open Jobs</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="section-box">
//             <div className="container">
//               <div className="panel-white">
//                 <div className="panel-head">
//                   <h5>Queries by search</h5>
//                   <Menu as="div">
//                     <Menu.Button as="a" className="menudrop" />
//                     <Menu.Items
//                       as="ul"
//                       className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
//                       style={{ right: "0", left: "auto" }}
//                     >
//                       <li>
//                         <Link className="dropdown-item active" href="#">
//                           Add new
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Settings
//                         </Link>
//                       </li>
//                       <li>
//                         <Link className="dropdown-item" href="#">
//                           Actions
//                         </Link>
//                       </li>
//                     </Menu.Items>
//                   </Menu>
//                 </div>
//                 <div className="panel-body">
//                   <div className="card-style-5 hover-up">
//                     <div className="card-title">
//                       <h6 className="font-sm">Developer</h6>
//                     </div>
//                     <div className="card-progress">
//                       <div className="number font-sm">2635</div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar"
//                           style={{ width: "100%" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-style-5 hover-up">
//                     <div className="card-title">
//                       <h6 className="font-sm">UI/Ux Designer</h6>
//                     </div>
//                     <div className="card-progress">
//                       <div className="number font-sm">1658</div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar"
//                           style={{ width: "90%" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-style-5 hover-up">
//                     <div className="card-title">
//                       <h6 className="font-sm">Marketing</h6>
//                     </div>
//                     <div className="card-progress">
//                       <div className="number font-sm">1452</div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar"
//                           style={{ width: "80%" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-style-5 hover-up">
//                     <div className="card-title">
//                       <h6 className="font-sm">Content manager</h6>
//                     </div>
//                     <div className="card-progress">
//                       <div className="number font-sm">1325</div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar"
//                           style={{ width: "70%" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-style-5 hover-up">
//                     <div className="card-title">
//                       <h6 className="font-sm">Ruby on rain</h6>
//                     </div>
//                     <div className="card-progress">
//                       <div className="number font-sm">985</div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar"
//                           style={{ width: "60%" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-style-5 hover-up">
//                     <div className="card-title">
//                       <h6 className="font-sm">Human hunter</h6>
//                     </div>
//                     <div className="card-progress">
//                       <div className="number font-sm">920</div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar"
//                           style={{ width: "50%" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-style-5 hover-up">
//                     <div className="card-title">
//                       <h6 className="font-sm">Finance</h6>
//                     </div>
//                     <div className="card-progress">
//                       <div className="number font-sm">853</div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar"
//                           style={{ width: "40%" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div> */}
//         {/* <div className="mt-10">
//           <div className="section-box">
//             <div className="container">
//               <div className="panel-white pt-30 pb-30 pl-15 pr-15">
//                 <div className="box-swiper">
//                   <div className="swiper-container swiper-group-10">
//                     <BrandSlider />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div> */}
//       </Layout>
//     </>
//   );
// }
