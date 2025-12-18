import { useRouter } from "next/router";

export default function ListView({ job }) {
  const router = useRouter();
  const handleNavigate = () => {
    // Navigate to job details page
    router.push(`/recruiter/manage-job-details`); // Assuming job.id is available
  };
  return (
    <>
      <div
        className="card-style-2 hover-up"
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
      >
        <div className="card-head">
          <div className="card-image">
            {" "}
            <img src={`/assets/imgs/brands/${job.img}`} alt="jobBox" />
          </div>
          <div className="card-title">
            <h6>{job.title}</h6>
            <span className="job-type">{job.type}</span>
            <span className="time-post">{job.date} mins ago</span>
            <span className="location">New York, US</span>
          </div>
        </div>
        <div className="card-tags">
          {job.tags.map((item, i) => (
            <a className="btn btn-tag" key={i}>
              {item}
            </a>
          ))}
        </div>
        <div className="card-price">
          <strong>${job.salary}</strong>
          <span className="hour">/Hour</span>
        </div>
      </div>
    </>
  );
}
