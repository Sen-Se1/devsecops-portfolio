Vagrant.configure("2") do |config|

  config.vm.box = "generic/ubuntu2204"
  config.vm.hostname = "ubuntu-target"

  config.vm.network "private_network", ip: "192.168.122.125"

  config.vm.provider "libvirt" do |v|
    v.memory = 4096
    v.cpus = 2
  end

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