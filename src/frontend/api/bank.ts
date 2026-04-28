import axios from "@/lib/axios";

export interface BankOption {
  id: string;
  name: string;
  code: string;
  icon: string | null;
  color: string | null;
}

const bankApi = {
  getAll: () => axios.get<{ data: BankOption[] }>(`/bank`),
};

export default bankApi;
