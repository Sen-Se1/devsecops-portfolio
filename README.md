Yes 👍 Let's keep the `README.md` **very simple**, with only the required commands, a short sentence, and a screenshot for each step.

You can use this structure directly.

# DevSecOps Portfolio

## 1. Ubuntu Server and SSH

Ubuntu Server 26.04 was installed and SSH was configured.

```bash
sudo apt update
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh
```

![SSH configuration](images/01-ssh.png)

---

