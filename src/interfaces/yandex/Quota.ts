interface Quota {
  files_count: number;
  filesize_limit: number;
  free: number;
  limit: number;
  trash: number;
  uid: string;
  used: number;
}

export default Quota;
