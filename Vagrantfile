Vagrant.configure("2") do |config|
  config.vm.box = "generic/ubuntu2204"
  config.vm.hostname = "ubuntu-target"

  config.vm.provider "libvirt" do |v|
    v.memory = 4096
    v.cpus = 2
  end

  config.vm.network "forwarded_port", guest: 3000, host: 3000, host_ip: "0.0.0.0"
  config.vm.network "forwarded_port", guest: 4000, host: 4000, host_ip: "0.0.0.0"

  # Automatically configure the VM and deploy the portfolio with Ansible
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/playbooks/deploy-portfolio.yml"

    # Match the group targeted by the deployment playbook
    ansible.groups = {
      "portfolio_servers" => ["default"]
    }

    ansible.become = true
    ansible.verbose = "v"
  end
end